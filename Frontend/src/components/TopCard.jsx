// TopCard.jsx
import { Crown } from "lucide-react";
import { motion } from "framer-motion";

const TopCard = ({ user, index }) => {
  const isFirst = index === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="relative px-4 py-4 rounded-xl text-center group"
      style={{
        background: "var(--bg-secondary)",
        border: isFirst
          ? "1px solid var(--accent)"
          : "1px solid var(--border)",
      }}
    >
      {/* subtle hover highlight */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 rounded-xl"
        style={{
          background:
            "linear-gradient(180deg, transparent, rgba(0,0,0,0.02))",
        }}
      />

      {/* 👑 Rank */}
      <div className="flex items-center justify-center gap-1 mb-2">
        <span
          className="text-[10px] font-medium"
          style={{ color: "var(--text-secondary)" }}
        >
          #{index + 1}
        </span>

        {isFirst && (
          <Crown size={14} style={{ color: "var(--accent)" }} />
        )}
      </div>

      {/* 🧑 Avatar */}
      <div className="relative flex justify-center">
        <img
          src={user.profileImage}
          className="w-11 h-11 rounded-full"
          style={{
            border: isFirst
              ? "2px solid var(--accent)"
              : "2px solid var(--border)",
          }}
        />
      </div>

      {/* 👤 Name */}
      <h3
        className="mt-3 text-sm font-medium"
        style={{ color: "var(--text-primary)" }}
      >
        {user.name}
      </h3>

      {/* 🔢 Points */}
      <p
        className="text-sm font-semibold mt-1"
        style={{
          color: isFirst
            ? "var(--accent)"
            : "var(--text-primary)",
        }}
      >
        {user.points}
        <span
          className="text-[10px] ml-1"
          style={{ color: "var(--text-secondary)" }}
        >
          pts
        </span>
      </p>
    </motion.div>
  );
};

export default TopCard;