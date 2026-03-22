import axios from "./axios";

export const searchUsers = async (query) => {
  const res = await axios.get(`/auth/search?query=${query}`, {
    withCredentials: true,
  });
  return res.data;
};