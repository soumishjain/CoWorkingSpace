import { Trophy } from "lucide-react";

const MyRankCard = ({ myRank }) => {
  if (!myRank || !myRank.rank) {
    return (
      <div className="rounded-2xl px-5 py-4 bg-gray-50 text-gray-500 text-sm flex items-center justify-between">
        <span>You are not participating</span>
        <span className="text-xs">—</span>
      </div>
    );
  }

  return (
    <div className="relative rounded-3xl px-6 py-5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md overflow-hidden group">
      
      {/* subtle glow */}
      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition duration-300" />

      <div className="relative flex items-center justify-between">
        
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-white/20 backdrop-blur">
            <Trophy size={18} />
          </div>

          <div>
            <p className="text-xs opacity-80">Your Rank</p>
            <h2 className="text-2xl font-bold leading-tight">
              #{myRank.rank}
            </h2>
          </div>
        </div>

        {/* RIGHT */}
        <div className="text-right">
          <p className="text-xs opacity-80">Points</p>
          <p className="text-lg font-semibold">
            {myRank.points}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyRankCard;