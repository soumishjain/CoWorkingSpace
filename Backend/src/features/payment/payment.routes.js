import express from "express";
import { identifyUser } from "../../middleware/auth.middleware.js";
import { createOrder, getBillingDetails, verifyPayment } from "./payment.controllers.js";

const paymentRouter = express.Router();

paymentRouter.post("/create-order",identifyUser ,createOrder);
paymentRouter.post("/verify",identifyUser, verifyPayment);
paymentRouter.get('/billings',identifyUser,getBillingDetails)

export default paymentRouter;