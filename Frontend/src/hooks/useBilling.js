import { useEffect } from "react";
import { getBillingDetails } from "../api/billing.api";
import { toast } from "react-hot-toast";

export const useBilling = (state) => {

  const { setData, setLoading, setError } = state;

  const fetchBilling = async () => {
    try {
      setLoading(true);

      const res = await getBillingDetails();

      setData({
        subscriptions: res.subscriptions || [],
        payments: res.payments || []
      });

    } catch (err) {
      console.error(err);

      const msg = err.response?.data?.message || "Failed to fetch billing";
      setError(msg);
      toast.error(msg);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBilling();
  }, []);

  return {
    fetchBilling
  };
};