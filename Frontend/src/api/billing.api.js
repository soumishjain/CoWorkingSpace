import axios from "./axios";


export const getBillingDetails = async () => {
  const res = await axios.get("/payment/billings", {
    withCredentials: true
  });
  return res.data;
};