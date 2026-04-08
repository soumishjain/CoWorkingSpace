import React from "react";

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen 
                    bg-[var(--bg-main)]">

      <div className="relative">

        {/* BASE CIRCLE */}
        <div className="w-14 h-14 border-4 
                        border-[var(--border)] 
                        rounded-full"></div>

        {/* SPINNER */}
        <div className="w-14 h-14 border-4 
                        border-[var(--accent)] 
                        border-t-transparent 
                        rounded-full animate-spin 
                        absolute top-0 left-0 
                        shadow-[0_0_15px_var(--accent-glow)]">
        </div>

      </div>

      {/* TEXT */}
      <p className="mt-4 text-[var(--text-secondary)] text-sm tracking-wide">
        Loading workspace...
      </p>

    </div>
  );
};

export default Loader;