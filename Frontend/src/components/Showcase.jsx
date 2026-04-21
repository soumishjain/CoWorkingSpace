export default function Showcase() {
  const items = [
    {
      title: "Workspace Analytics",
      desc: "Track activity, usage and collaboration insights across your workspaces.",
      icon: "📊"
    },
    {
      title: "Member Management",
      desc: "Invite members, manage permissions and collaborate seamlessly.",
      icon: "👥"
    },
    {
      title: "Smart Dashboard",
      desc: "A unified dashboard to control and monitor your entire workspace.",
      icon: "🧠"
    }
  ];

  return (
    <section className="max-w-6xl mx-auto px-6 py-28">

      {/* 🔥 HEADER */}
      <div className="mb-20">

        <h2 className="text-5xl font-semibold tracking-tight 
                       text-[var(--text-primary)] leading-tight max-w-3xl">
          A better way to manage your workspace
        </h2>

        <p className="mt-6 text-[var(--text-secondary)] text-lg max-w-xl">
          Designed to simplify collaboration and give you complete control over your team and tasks.
        </p>

      </div>

      {/* 🔥 LIST */}
      <div className="divide-y divide-[var(--border)]">

        {items.map((item, i) => (
          <div
            key={i}
            className="group flex items-start justify-between py-10 
                       hover:bg-[var(--bg-hover)]/60 
                       transition px-4 -mx-4 rounded-xl"
          >

            {/* LEFT */}
            <div className="flex items-start gap-6 max-w-xl">

              {/* ICON */}
              <div className="text-3xl">
                {item.icon}
              </div>

              {/* TEXT */}
              <div>
                <h3 className="text-xl font-semibold 
                               text-[var(--text-primary)] 
                               group-hover:text-[var(--accent)] 
                               transition">
                  {item.title}
                </h3>

                <p className="text-[var(--text-secondary)] mt-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>

            </div>

            {/* RIGHT VISUAL */}
            <div className="hidden md:block">

              <div className="w-40 h-24 
                              bg-[var(--bg-secondary)] 
                              border border-[var(--border)] 
                              rounded-xl shadow-sm 
                              group-hover:shadow-[0_0_15px_var(--accent-glow)] 
                              transition flex items-center justify-center 
                              text-xs text-[var(--text-secondary)]">
                Preview
              </div>

            </div>

          </div>
        ))}

      </div>

    </section>
  );
}