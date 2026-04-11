import React from "react";
import { useParams } from "react-router-dom";

import { useLeaderboard } from "../hooks/useLeaderboard";
import { usePrevWinner } from "../hooks/usePrevWinner";

import TopThreeBar from "../components/TopThreeBar";
import MyRankCard from "../components/MyRankCard";
import LeaderboardList from "../components/LeaderboardList";
import PreviousWinnerCard from "../components/PreviousWinnerCard";

const Department = () => {
  const { workspaceId, departmentId } = useParams();

  const { leaderboard, top3, myRank, loading, error } =
    useLeaderboard(workspaceId, departmentId);

  const { prevWinner, loadingWinner } =
    usePrevWinner(workspaceId, departmentId);

  // 🔥 LOADING UI (theme based)
  if (loading) {
    return (
      <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-16 rounded-xl animate-pulse"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
            }}
          />
        ))}
      </div>
    );
  }

  // 🔥 ERROR UI
  if (error) {
    return (
      <div className="p-6 text-sm rounded-xl"
        style={{
          background: "rgba(239,68,68,0.1)",
          color: "#ef4444",
          border: "1px solid rgba(239,68,68,0.2)"
        }}
      >
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">

      {/* 🔥 HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-3xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Leaderboard
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: "var(--text-secondary)" }}
          >
            Track top performers in your department
          </p>
        </div>
      </div>

      {/* 🔥 TOP SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* LEFT */}
        <div
          className={`rounded-2xl p-4 ${
            prevWinner ? "md:col-span-2" : "md:col-span-3"
          }`}
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.25)"
          }}
        >
          <TopThreeBar data={top3} />
        </div>

        {/* RIGHT */}
        {prevWinner && (
          <div
            className="rounded-2xl p-4"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.25)"
            }}
          >
            <PreviousWinnerCard
              winner={prevWinner}
              loading={loadingWinner}
            />
          </div>
        )}
      </div>

      {/* 🔥 MY RANK */}
      <div
        className="rounded-2xl p-4"
        style={{
          background: "linear-gradient(135deg, rgba(255,106,0,0.1), transparent)",
          border: "1px solid var(--border)",
          boxShadow: "0 0 20px var(--accent-glow)"
        }}
      >
        <MyRankCard myRank={myRank} />
      </div>

      {/* 🔥 LEADERBOARD LIST */}
      <div
        className="rounded-2xl p-4"
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border)",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
        }}
      >
        <LeaderboardList data={leaderboard} />
      </div>

    </div>
  );
};

export default Department;