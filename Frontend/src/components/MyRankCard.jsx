// MyRankCard.jsx
import { Trophy } from "lucide-react";
import { motion } from "framer-motion";

const MyRankCard = ({ myRank }) => {
  if (!myRank || !myRank.rank) {
    return (
      <div
        className="rounded-xl px-4 py-3 flex items-center justify-between text-sm"
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border)",
          color: "var(--text-secondary)",
        }}
      >
        <span>You are not participating</span>
        <span className="text-xs">—</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="rounded-xl px-4 py-4"
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border)",
      }}
    >
      <div className="flex items-center justify-between">
        
        {/* LEFT */}
        <div className="flex items-center gap-3">
          
          {/* icon (clean, no glow) */}
          <div
            className="p-2 rounded-lg"
            style={{
              background: "var(--bg-hover)",
              border: "1px solid var(--border)",
            }}
          >
            <Trophy size={16} style={{ color: "var(--accent)" }} />
          </div>

          {/* text */}
          <div>
            <p
              className="text-[10px] uppercase tracking-wider"
              style={{ color: "var(--text-secondary)" }}
            >
              Rank
            </p>

            <h2
              className="text-lg font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              #{myRank.rank}
            </h2>
          </div>
        </div>

        {/* RIGHT */}
        <div className="text-right">
          <p
            className="text-[10px] uppercase tracking-wider"
            style={{ color: "var(--text-secondary)" }}
          >
            Points
          </p>

          <p
            className="text-sm font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            {myRank.points}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default MyRankCard;