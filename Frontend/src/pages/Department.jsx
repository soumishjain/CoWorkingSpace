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

  // 🔥 leaderboard data
  const { leaderboard, top3, myRank, loading, error } =
    useLeaderboard(workspaceId, departmentId);

  // 🔥 previous winner (missing tha)
  const { prevWinner, loadingWinner } =
    usePrevWinner(workspaceId, departmentId);

  if (loading) {
    return (
      <div className="space-y-3 animate-pulse">
  {[1,2,3,4].map((i) => (
    <div key={i} className="h-14 bg-gray-100 rounded-xl" />
  ))}
</div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
      
      {/* 🔥 Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          Leaderboard
        </h1>
      </div>

      {/* 🔥 TOP SECTION */}
     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  
  {/* LEFT → Graph */}
  <div className={prevWinner ? "md:col-span-2" : "md:col-span-3"}>
  <TopThreeBar data={top3} />

</div>

  {/* RIGHT → Previous Winner */}
  {prevWinner && (
    <PreviousWinnerCard
      winner={prevWinner}
      loading={loadingWinner}
    />
  )}

</div>

      {/* 🔥 My Rank */}
      <MyRankCard myRank={myRank} />

      {/* 🔥 Leaderboard List */}
      <LeaderboardList data={leaderboard} />

    </div>
  );
};

export default Department;