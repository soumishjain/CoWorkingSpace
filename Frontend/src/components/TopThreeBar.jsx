// TopThreeBar.jsx
import { Crown } from "lucide-react";
import { motion } from "framer-motion";

const TopThreeBar = ({ data }) => {
  if (!data || data.length === 0) return null;

  const order = [1, 0, 2];

  const getRankStyle = (rank) => {
    if (rank === 0)
      return {
        color: "#FFD700",
        glow: "0 0 25px rgba(255,215,0,0.25)",
      };
    if (rank === 1)
      return {
        color: "#C0C0C0",
        glow: "0 0 15px rgba(192,192,192,0.2)",
      };
    if (rank === 2)
      return {
        color: "#CD7F32",
        glow: "0 0 15px rgba(205,127,50,0.2)",
      };
  };

  return (
    <div
      className="rounded-3xl p-6"
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border)",
      }}
    >
      {/* Heading */}
      <h2
        className="text-lg font-semibold text-center mb-8"
        style={{ color: "var(--text-primary)" }}
      >
        Top Performers
      </h2>

      {/* Podium */}
      <div className="flex items-end justify-center gap-5">
        {order.map((pos, i) => {
          const user = data[pos];
          if (!user) return null;

          const isFirst = pos === 0;
          const style = getRankStyle(pos);

          return (
            <motion.div
              key={pos}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="flex flex-col items-center"
            >
              {/* CARD */}
              <div
                className={`relative flex flex-col items-center rounded-2xl px-4 py-4 ${
                  isFirst ? "mb-4" : "mb-2"
                }`}
                style={{
                  background: "var(--bg-secondary)",
                  border: `1px solid ${style.color}40`,
                  boxShadow: isFirst ? style.glow : "none",
                }}
              >
                {/* Crown */}
                {isFirst && (
                  <div className="absolute -top-4">
                    <Crown size={18} style={{ color: style.color }} />
                  </div>
                )}

                {/* Avatar */}
                <img
                  src={
                    user.profileImage ||
                    "https://ui-avatars.com/api/?name=User"
                  }
                  className={`rounded-full ${
                    isFirst ? "w-14 h-14" : "w-11 h-11"
                  }`}
                  style={{
                    border: `2px solid ${style.color}`,
                  }}
                />

                {/* Name */}
                <p
                  className="text-sm font-medium mt-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  {user.name}
                </p>

                {/* Points */}
                <p
                  className="text-xs"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {user.points} pts
                </p>
              </div>

              {/* PODIUM BASE */}
              <div
                className={`w-14 rounded-xl ${
                  isFirst ? "h-16" : pos === 1 ? "h-12" : "h-10"
                }`}
                style={{
                  background:
                    "linear-gradient(180deg, var(--bg-hover), transparent)",
                  border: "1px solid var(--border)",
                }}
              />

              {/* Rank */}
              <span
                className="text-xs mt-2 font-semibold"
                style={{ color: style.color }}
              >
                #{pos + 1}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TopThreeBar;