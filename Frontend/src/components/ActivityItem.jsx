import { Clock } from "lucide-react";

const ActivityItem = ({ activity }) => {
  const name = activity.userId?.name || "User";
  const firstLetter = name.charAt(0).toUpperCase();
  const time = new Date(activity.createdAt).toLocaleString();

  return (
    <div className="relative flex gap-4 group">

      {/* 🔥 TIMELINE DOT */}
      <div className="relative flex flex-col items-center">

        <div className="w-3 h-3 rounded-full 
                        bg-[var(--accent)] 
                        shadow-[0_0_10px_var(--accent-glow)]" />

      </div>

      {/* 🔥 CONTENT */}
      <div className="flex-1">

        <div className="relative p-4 rounded-xl 
                        bg-[var(--bg-secondary)]/70 
                        backdrop-blur-xl 
                        border border-[var(--border)] 
                        transition-all duration-300 
                        group-hover:bg-[var(--bg-hover)]">

          {/* 🔥 GLOW */}
          <div className="absolute inset-0 opacity-0 
                          group-hover:opacity-100 
                          transition duration-500 
                          bg-[radial-gradient(circle_at_top,rgba(255,106,0,0.15),transparent_70%)]" />

          {/* 🔥 USER */}
          <div className="flex items-center gap-3 mb-2">

            {/* AVATAR */}
            <div className="w-8 h-8 rounded-full 
                            bg-[var(--accent)]/15 
                            text-[var(--accent)] 
                            flex items-center justify-center 
                            text-xs font-semibold">
              {firstLetter}
            </div>

            <p className="text-sm font-medium text-[var(--text-primary)]">
              {name}
            </p>

          </div>

          {/* 🔥 MESSAGE */}
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            {activity.message}
          </p>

          {/* 🔥 TIME */}
          <div className="flex items-center gap-1 mt-3 text-xs text-[var(--text-secondary)]">
            <Clock size={12} />
            <span>{time}</span>
          </div>

        </div>

      </div>

    </div>
  );
};

export default ActivityItem;