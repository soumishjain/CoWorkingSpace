export default function Features() {
  const features = [
    {
      title: "Workspace Management",
      desc: "Create and manage multiple coworking spaces easily."
    },
    {
      title: "Team Collaboration",
      desc: "Invite members and collaborate in real-time."
    },
    {
      title: "Smart Dashboard",
      desc: "Track activity and manage resources efficiently."
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">

      <h2 className="text-3xl font-bold text-center mb-12">
        Powerful Features
      </h2>

      <div className="grid md:grid-cols-3 gap-8">

        {features.map((f, i) => (
          <div
            key={i}
            className="p-6 rounded-xl border border-gray-200 hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold mb-2">
              {f.title}
            </h3>

            <p className="text-gray-500">
              {f.desc}
            </p>
          </div>
        ))}

      </div>

    </section>
  );
}