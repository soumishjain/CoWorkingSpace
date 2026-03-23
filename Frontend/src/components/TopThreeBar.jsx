import { Crown } from "lucide-react";
import { motion } from "framer-motion";

const TopThreeBar = ({ data }) => {
  if (!data || data.length === 0) return null;

  const order = [1, 0, 2];

  return (
    <div className="bg-gradient-to-b from-emerald-50 to-white border border-emerald-100 rounded-3xl bg-white p-8 shadow-sm border border-gray-100">
      
      <h2 className="text-xl font-semibold text-gray-900 text-center mb-10 tracking-tight">
        Top Performers
      </h2>

      <div className="flex items-end justify-center gap-8">
        {order.map((pos, i) => {
          const user = data[pos];
          if (!user) return null;

          const isFirst = pos === 0;

          return (
            <motion.div
              key={pos}
              
              // ✅ ENTRY ONLY (runs once)
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}

              whileHover={{ y: -6, scale: 1.06 }}

              className={`relative flex flex-col items-center rounded-2xl px-6 py-6 transition-all duration-300
              ${
  pos === 0
    ? "bg-gradient-to-b from-yellow-50 to-white shadow-lg scale-110"
    : pos === 1
    ? "bg-gradient-to-b from-blue-50 to-white hover:shadow"
    : "bg-gradient-to-b from-orange-50 to-white hover:shadow"
}`}
            >
              {/* 🔥 FLOAT LAYER (SEPARATE — FIXED) */}
              <motion.div
                animate={isFirst ? { y: [0, -6, 0] } : {}}
                transition={
                  isFirst
                    ? {
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }
                    : {}
                }
                className="flex flex-col items-center"
              >
                {/* glow */}
                {isFirst && (
                  <div className="absolute inset-0 rounded-2xl bg-yellow-300/20 blur-xl opacity-40" />
                )}

                {/* crown */}
                {isFirst && (
                  <div className="absolute -top-5">
                    <Crown size={20} className="text-yellow-500" />
                  </div>
                )}

                {/* avatar */}
                <div className="relative mb-3">
                  <img
                    src={
                      user.profileImage ||
                      "https://ui-avatars.com/api/?name=User"
                    }
                    className={`rounded-full object-cover ${
                      isFirst
                        ? "w-16 h-16 shadow-md"
                        : "w-12 h-12"
                    }`}
                  />
                </div>

                {/* name */}
                <p className="text-sm font-semibold text-gray-900">
                  {user.name}
                </p>

                {/* points */}
                <p className="text-sm text-gray-500 mt-1">
                  {user.points} pts
                </p>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TopThreeBar;