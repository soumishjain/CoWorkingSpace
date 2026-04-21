// LeaderboardList.jsx
import { Crown } from "lucide-react";
import { motion } from "framer-motion";

const LeaderboardList = ({ data }) => {
  if (!data.length) {
    return (
      <div
        className="text-center py-10 text-sm"
        style={{ color: "var(--text-secondary)" }}
      >
        No leaderboard data yet 🚀
      </div>
    );
  }

  return (
    <motion.div layout className="space-y-2">
      {data.map((user, index) => {
        const isTop = index < 3;
        const isFirst = index === 0;

        return (
          <motion.div
            key={user._id}
            layout
            transition={{ type: "spring", stiffness: 500, damping: 40 }}
            whileHover={{ y: -2 }}
            className="group flex items-center justify-between px-4 py-3 rounded-xl"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
            }}
          >
            {/* LEFT */}
            <div className="flex items-center gap-3">
              
              {/* Rank */}
              <div
                className="w-8 h-8 flex items-center justify-center rounded-full text-xs font-semibold"
                style={{
                  background: "var(--bg-hover)",
                  border: "1px solid var(--border)",
                  color: isTop
                    ? "var(--accent)"
                    : "var(--text-secondary)",
                }}
              >
                {isFirst ? <Crown size={13} /> : index + 1}
              </div>

              {/* Avatar */}
              <img
                src={
                  user.profileImage ||
                  "https://ui-avatars.com/api/?name=User"
                }
                className="w-9 h-9 rounded-full"
                style={{
                  border: isTop
                    ? "2px solid rgba(255,106,0,0.4)"
                    : "2px solid var(--border)",
                }}
              />

              {/* Name + Email */}
              <div className="leading-tight">
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  {user.name}
                </p>
                <p
                  className="text-xs"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {user.email || "—"}
                </p>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-2">
              
              {/* optional rank change */}
              {/* <span className="text-[10px] text-green-500">↑2</span> */}

              <p
                className="text-sm font-semibold"
                style={{
                  color: isTop
                    ? "var(--accent)"
                    : "var(--text-primary)",
                }}
              >
                {user.points}
              </p>

              <span
                className="text-[10px]"
                style={{ color: "var(--text-secondary)" }}
              >
                pts
              </span>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default LeaderboardList;