
import crypto from "crypto";
import mongoose from "mongoose";
import { PLANS } from "../../utils/plans.js";
import workspaceModel from "../../models/workspace.models.js";
import { razorpay } from "../../config/razorpay.js";
import paymentModel from "../../models/payment.models.js";
import { createWorkspaceService } from "../workspace/workspace.controllers.js";
import subscriptionModel from "../../models/subscription.models.js";




// 🔥 CREATE ORDER
export async function createOrder(req, res) {
  try {
    const userId = req.userId;
    const { plan, name, description } = req.body;

    // ✅ VALIDATION (IMPORTANT)
    if (!name || !plan) {
      return res.status(400).json({
        message: "Please fill all required fields"
      });
    }

    if (!PLANS[plan] || plan === "individual") {
      return res.status(400).json({
        message: "Invalid plan"
      });
    }

    // ✅ optional: trim + normalize
    const formattedName = name.toLowerCase().trim();

    // ✅ check duplicate workspace name BEFORE payment
    const existing = await workspaceModel.findOne({ name: formattedName });
    if (existing) {
      return res.status(409).json({
        message: "Workspace name already exists"
      });
    }

    const amount = PLANS[plan].price * 100;

    const order = await razorpay.orders.create({
      amount,
      currency: "INR"
    });

    await paymentModel.create({
      userId,
      plan,
      amount: amount / 100,
      orderId: order.id,
      status: "created"
    });

    return res.json({
      orderId: order.id,
      amount
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Order creation failed"
    });
  }
}


// 🔥 VERIFY + CREATE WORKSPACE
export async function verifyPayment(req, res) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.userId;

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      name,
      description,
      plan
    } = req.body;

    // 🔐 verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Invalid payment" });
    }

    const payment = await paymentModel.findOne({
      orderId: razorpay_order_id
    });

    if (!payment) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Payment not found" });
    }

    // 🔥 retry safe
    if (payment.status === "success") {
      if (payment.workspaceId) {
        await session.abortTransaction();
        return res.json({
          message: "Workspace already created",
          workspaceId: payment.workspaceId
        });
      }
    } else {
      payment.status = "success";
      payment.paymentId = razorpay_payment_id;
      await payment.save({ session });
    }

    // 🔥 create workspace via service
    const workspace = await createWorkspaceService({
      userId,
      name,
      description,
      plan,
      payment,
      session
    });

    await session.commitTransaction();
    session.endSession();

    return res.json({
      message: "Workspace created after payment",
      workspace
    });

  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    console.error(err);
    res.status(500).json({ message: "Error" });
  }
}

export async function getBillingDetails(req, res) {
  try {
    const userId = req.userId;

    // 🔥 saare workspace payments (user level billing)
    const payments = await paymentModel.find({ userId })
      .sort({ createdAt: -1 });

    // 🔥 subscriptions (for current plan per workspace)
    const subscriptions = await subscriptionModel.find({
      workspaceId: { $ne: null }
    }).populate("workspaceId", "name");

    return res.json({
      payments,
      subscriptions
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching billing" });
  }
}