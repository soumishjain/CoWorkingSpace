import { useEffect, useState } from "react";
import { fetchPrevWinner } from "../api/leaderboard.api";

export const usePrevWinner = (workspaceId, departmentId) => {
  const [prevWinner, setPrevWinner] = useState(null);
  const [loadingWinner, setLoadingWinner] = useState(true);

  useEffect(() => {
    const loadWinner = async () => {
      try {
        setLoadingWinner(true);

        const res = await fetchPrevWinner(
          workspaceId,
          departmentId
        );

        setPrevWinner(res.data.winner);
      } catch (err) {
        console.error("Prev winner error:", err);
        setPrevWinner(null);
      } finally {
        setLoadingWinner(false);
      }
    };

    if (workspaceId && departmentId) {
      loadWinner();
    }
  }, [workspaceId, departmentId]);

  return { prevWinner, loadingWinner };
};