export default function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">

      {/* Left */}
      <div>
        <h1 className="text-5xl font-bold leading-tight">
          Manage your
          <span className="text-[var(--color-primary)]"> coworking spaces</span>
          effortlessly
        </h1>

        <p className="mt-6 text-gray-500 text-lg">
          Create workspaces, collaborate with your team, and manage everything
          from a single powerful dashboard.
        </p>

        <div className="mt-8 flex gap-4">
          <button className="px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white hover:bg-[var(--color-secondary)]">
            Create Workspace
          </button>

          <button className="px-6 py-3 rounded-xl border">
            Explore
          </button>
        </div>
      </div>

      {/* Right */}
      <div className="bg-gray-100 rounded-2xl h-[350px] flex items-center justify-center">
        <p className="text-gray-400">Dashboard Preview</p>
      </div>

    </section>
  );
}