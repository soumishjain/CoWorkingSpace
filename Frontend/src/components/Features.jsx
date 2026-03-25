export default function Features() {
  const blocks = [
    {
      title: "Manage everything in one place",
      desc: "Create workspaces, organize departments, and handle everything without switching tools.",
      tags: ["Workspaces", "Departments", "Roles"],
      float: "+3 departments created",
    },
    {
      title: "Real-time collaboration",
      desc: "Assign tasks, manage teams, and collaborate without friction.",
      tags: ["Chat", "Tasks", "Roles"],
      float: "👥 12 members active",
      reverse: true,
    },
    {
      title: "Track performance effortlessly",
      desc: "Monitor progress, track completion, and keep your team aligned.",
      tags: ["Analytics", "Progress", "Reports"],
      float: "📊 92% progress",
    },
  ];

  return (
    <section className="relative max-w-7xl mx-auto px-6 py-24">

      {/* 🔥 BACKGROUND */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[650px] h-[650px] bg-indigo-200 rounded-full blur-3xl opacity-20" />
      </div>

      {/* 🔥 HEADER */}
      <div className="text-center max-w-2xl mx-auto mb-20">
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-gray-900 leading-tight">
          Built for teams who{" "}
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
            move fast
          </span>
        </h2>

        <p className="mt-4 text-gray-500 text-base">
          A complete system — not just features.
        </p>
      </div>

      {/* 🔥 BLOCKS */}
      <div className="flex flex-col gap-20">

        {blocks.map((b, i) => (
          <div
            key={i}
            className={`grid md:grid-cols-2 gap-12 items-center ${
              b.reverse ? "md:[&>*:first-child]:order-2" : ""
            }`}
          >

            {/* TEXT */}
            <div className="group">
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition">
                {b.title}
              </h3>

              <p className="mt-3 text-gray-500 text-sm leading-relaxed">
                {b.desc}
              </p>

              <div className="mt-4 flex gap-2 flex-wrap text-xs text-gray-600">
                {b.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-gray-100 rounded-full hover:bg-indigo-50 hover:text-indigo-600 transition"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* VISUAL */}
            <div className="relative group">

              <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-4 transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">

                {/* WINDOW DOTS */}
                <div className="flex gap-2 mb-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-300" />
                </div>

                {/* CONTENT */}
                <div className="space-y-2">
                  <div className="h-3 w-1/2 bg-gray-200 rounded" />
                  <div className="h-2.5 w-3/4 bg-gray-100 rounded" />

                  <div className="mt-3 space-y-2">

  {/* ROW 1 */}
  <div className="flex items-center justify-between bg-gray-50  rounded-lg px-3 py-2">
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 rounded-md bg-indigo-100" />
      <div className="h-2.5 w-20 bg-gray-200 rounded" />
    </div>
    <div className="h-2 w-10 bg-gray-200 rounded" />
  </div>

  {/* ROW 2 */}
  <div className="flex items-center justify-between bg-gray-50  rounded-lg px-3 py-2">
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 rounded-md bg-purple-100" />
      <div className="h-2.5 w-24 bg-gray-200 rounded" />
    </div>
    <div className="h-2 w-12 bg-gray-200 rounded" />
  </div>

  {/* ROW 3 */}
  <div className="flex items-center justify-between bg-gray-50  rounded-lg px-3 py-2">
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 rounded-md bg-blue-100" />
      <div className="h-2.5 w-16 bg-gray-200 rounded" />
    </div>
    <div className="h-2 w-8 bg-gray-200 rounded" />
  </div>

</div>
                </div>

              </div>

              {/* FLOAT */}
              <div className="absolute -bottom-6 -right-4 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-[11px] shadow-sm group-hover:-translate-y-1 transition">
                {b.float}
              </div>

            </div>

          </div>
        ))}

      </div>

    </section>
  );
}