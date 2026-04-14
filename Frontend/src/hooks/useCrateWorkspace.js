import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useState } from "react";

import {
  createFreeWorkspace,
  createOrder,
  verifyPayment
} from "../api/workspace.api";

import { loadRazorpay } from "../utils/loadRazorpay";

export const useCreateWorkspace = (state, closeModal, refreshWorkspaces) => {

  const navigate = useNavigate();
  const { formData, setLoading, setError } = state;

  // 🔥 retry state
  const [retryPayload, setRetryPayload] = useState(null);

  // 🔁 RETRY FUNCTION
  const retryWorkspaceCreation = async () => {
    try {
      if (!retryPayload) return;

      setLoading(true);

      const res = await verifyPayment(retryPayload);

      toast.success("Workspace created 🎉");

      refreshWorkspaces();
      closeModal();

      navigate(`workspace/${res.workspace._id}`);

      setRetryPayload(null);

    } catch (err) {
      toast.error("Retry failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const submitWorkspace = async () => {
    try {
      setLoading(true);

      // 🟢 FREE PLAN
      if (formData.plan === "individual") {
        const res = await createFreeWorkspace(formData);

        toast.success("Workspace created 🎉");

        refreshWorkspaces();
        closeModal();

        navigate(`/workspace/${res.workspace._id}`);
        return;
      }

      // 🔴 PAID PLAN

      const loaded = await loadRazorpay();
      if (!loaded) {
        toast.error("Payment SDK failed");
        return;
      }

      const order = await createOrder(formData);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        order_id: order.orderId,

        handler: async function (response) {
          const payload = {
            ...response,
            name: formData.name,
            description: formData.description,
            plan: formData.plan
          };

          try {
            const res = await verifyPayment(payload);

            toast.success("Workspace created 🎉");

            refreshWorkspaces();
            closeModal();

            navigate(`/workspace/${res.workspace._id}`);

          } catch (err) {
            console.error(err);

            // 🔥 SAVE FOR RETRY
            setRetryPayload(payload);

            toast.error("Workspace creation failed. Retry?");
          }
        },

        modal: {
          ondismiss: function () {
            toast.error("Payment cancelled ❌");
            setLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function () {
        toast.error("Payment failed ❌");
        setLoading(false);
      });

      rzp.open();

    } catch (error) {
      const msg = error.response?.data?.message || "Something went wrong";
      toast.error(msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return { submitWorkspace, retryWorkspaceCreation, retryPayload };
};