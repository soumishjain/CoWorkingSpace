import cron from "node-cron";
import subscriptionModel from "../models/subscription.models.js";
import workspaceModel from "../models/workspace.models.js";


export const startSubscriptionCron = () => {

  // 🔥 runs every day at midnight
  cron.schedule("0 0 * * *", async () => {
    console.log("⏳ Running subscription expiry cron...");

    try {
      const now = new Date();

      // 🔍 find expired subscriptions
      const expiredSubs = await subscriptionModel.find({
        status: "active",
        endDate: { $lt: now }
      });

      for (const sub of expiredSubs) {

        // ❌ mark expired
        sub.status = "expired";
        sub.isReadOnly = true;
        await sub.save();

        // 🔒 lock workspace
        await workspaceModel.findByIdAndUpdate(
          sub.workspaceId,
          { plan: "individual" } // optional downgrade
        );
      }

      console.log(`✅ Expired ${expiredSubs.length} subscriptions`);

    } catch (err) {
      console.error("❌ Cron error:", err);
    }
  });

};