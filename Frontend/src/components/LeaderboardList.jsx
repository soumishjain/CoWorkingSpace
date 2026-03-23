import { Crown } from "lucide-react";
import { motion } from "framer-motion";

const LeaderboardList = ({ data }) => {
  if (!data.length) {
    return (
      <div className="text-center py-10 text-gray-500 text-sm">
        No leaderboard data yet 🚀
      </div>
    );
  }

  return (
    <motion.div layout className="space-y-3">
      {data.map((user, index) => {
        const isTop = index < 3;

        return (
          <motion.div
            key={user._id}
            layout
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 40,
            }}
            className={`group flex items-center justify-between px-5 py-4 rounded-2xl bg-white 
            hover:-translate-y-[2px] hover:shadow-md transition
            ${isTop ? "shadow-sm" : ""}`}
          >
            {/* LEFT */}
            <div className="flex items-center gap-4">
              
              {/* Rank */}
              <div
                className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-semibold
                ${
                  index === 0
                    ? "bg-yellow-100 text-yellow-600"
                    : index === 1
                    ? "bg-gray-200 text-gray-700"
                    : index === 2
                    ? "bg-orange-100 text-orange-600"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {index === 0 ? <Crown size={14} /> : index + 1}
              </div>

              {/* Avatar */}
              <img
                src={
                  user.profileImage ||
                  "https://ui-avatars.com/api/?name=User"
                }
                className="w-10 object-cover h-10 rounded-full"
              />

              {/* Name */}
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {user.name}
                </p>
                <p className="text-xs text-gray-400">
                  {user.email || "—"}
                </p>
              </div>
            </div>

            {/* Points */}
            <p className="font-semibold text-gray-900">
              {user.points} pts
            </p>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default LeaderboardList;