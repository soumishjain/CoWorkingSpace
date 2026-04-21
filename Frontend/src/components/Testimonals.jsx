import React from "react";

const testimonials = [
  {
    name: "Rohit",
    role: "Founder",
    text: "This changed how our team works 🚀",
  },
  {
    name: "Ananya",
    role: "Product Manager",
    text: "Super clean UI. Loved it.",
  },
  {
    name: "Karan",
    role: "Developer",
    text: "Feels like Notion + Slack combined 🔥",
  },
  {
    name: "Priya",
    role: "Designer",
    text: "Team productivity went 📈",
  },
  {
    name: "Aman",
    role: "Engineer",
    text: "Best workspace tool I've used",
  },
  {
    name: "Neha",
    role: "Manager",
    text: "Everything feels smooth and fast ⚡",
  },
];

export default function Testimonials() {
  return (
    <div className="mt-28 max-w-6xl mx-auto px-6">

      {/* 🔥 HEADER */}
      <div className="text-center mb-14">
        <h2 className="text-3xl font-semibold text-[var(--text-primary)]">
          Loved by teams worldwide
        </h2>

        <p className="text-[var(--text-secondary)] mt-3">
          Real feedback from people using our platform
        </p>
      </div>

      {/* 🔥 GRID */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {testimonials.map((t, i) => (
          <div
            key={i}
            className={`group relative p-6 rounded-2xl 
            bg-[var(--bg-secondary)]/70 
            backdrop-blur-xl 
            border border-[var(--border)] 
            shadow-sm 
            transition-all duration-500
            
            hover:-translate-y-2 hover:scale-[1.02]
            hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)]

            ${i % 2 === 0 ? "translate-y-4" : ""}
            `}
          >

            {/* 🔥 ORANGE GLOW */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 
                            transition duration-500 
                            bg-[radial-gradient(circle_at_top,rgba(255,106,0,0.2),transparent_70%)]" />

            {/* ⭐ STARS */}
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-[var(--accent)] text-sm">★</span>
              ))}
            </div>

            {/* TEXT */}
            <p className="relative text-sm text-[var(--text-primary)] leading-relaxed">
              “{t.text}”
            </p>

            {/* USER */}
            <div className="relative mt-5 flex items-center gap-3">

              {/* AVATAR */}
              <div className="w-9 h-9 rounded-full 
                              bg-[var(--accent)]/20 
                              flex items-center justify-center 
                              text-sm text-[var(--accent)] font-semibold">
                {t.name[0]}
              </div>

              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  {t.name}
                </p>
                <p className="text-xs text-[var(--text-secondary)]">
                  {t.role}
                </p>
              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}