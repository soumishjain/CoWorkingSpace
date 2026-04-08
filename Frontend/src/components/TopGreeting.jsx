import React from "react";
import { useAuth } from "../context/AuthContext";

const TopGreeting = () => {
  const { user } = useAuth();

  return (
    <div className="relative overflow-hidden rounded-2xl 
                    border border-[var(--border)] 
                    bg-[var(--bg-secondary)]/70 
                    backdrop-blur-xl px-6 py-6 
                    shadow-[0_10px_40px_rgba(0,0,0,0.3)]">

      {/* 🔥 ORANGE AMBIENT GLOW */}
      <div className="absolute -top-20 -left-20 w-72 h-72 
                      bg-[var(--accent)] rounded-full blur-3xl opacity-10" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 
                      bg-[var(--accent)] rounded-full blur-3xl opacity-10" />

      {/* 🔥 CONTENT */}
      <div className="relative flex items-center justify-between">

        {/* LEFT */}
        <div>

          {/* 🔥 TITLE */}
          <h2 className="text-2xl font-semibold tracking-tight 
                         text-[var(--text-primary)]">
            Welcome back,{" "}
            <span className="bg-gradient-to-r 
                             from-[var(--accent)] 
                             via-[#FF8C42] 
                             to-[#FFA366] 
                             bg-clip-text text-transparent">
              {user?.name}
            </span>
          </h2>

          {/* 🔥 SUBTEXT */}
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Let’s build something great today.
          </p>

          {/* 🔥 MINI INFO */}
          <div className="flex gap-4 mt-4 text-xs text-[var(--text-secondary)]">

            <div className="flex items-center gap-1 
                            bg-[var(--bg-hover)] 
                            px-3 py-1.5 rounded-lg border border-[var(--border)]">
              📅 {new Date().toLocaleDateString()}
            </div>

            <div className="flex items-center gap-1 
                            bg-[var(--bg-hover)] 
                            px-3 py-1.5 rounded-lg border border-[var(--border)]">
              ⚡ Productivity Mode
            </div>

          </div>

        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">

          {/* TEXT */}
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-[var(--text-primary)]">
              {user?.name}
            </p>
            <p className="text-xs text-[var(--text-secondary)]">
              Workspace Member
            </p>
          </div>

          {/* 🔥 AVATAR (UPGRADED) */}
          <div className="relative">

            {/* GLOW BORDER */}
            <div className="p-[2px] rounded-xl 
                            bg-gradient-to-tr 
                            from-[var(--accent)] 
                            to-[#FF8C42] 
                            shadow-[0_0_15px_var(--accent-glow)]">

              <img
                src={user?.profileImage}
                className="w-12 h-12 rounded-xl object-cover 
                           bg-[var(--bg-secondary)]"
              />
            </div>

            {/* ONLINE DOT */}
            <span className="absolute bottom-0 right-0 w-3 h-3 
                             bg-green-500 rounded-full 
                             border-2 border-[var(--bg-secondary)]" />
          </div>

        </div>

      </div>

    </div>
  );
};

export default TopGreeting;