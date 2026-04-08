export default function Footer() {
  return (
    <footer className="relative mt-28">

      {/* 🔥 TOP GRADIENT LINE */}
      <div className="h-[1px] w-full 
                      bg-gradient-to-r 
                      from-transparent 
                      via-[var(--accent)]/40 
                      to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* 🔥 TOP SECTION */}
        <div className="flex flex-col md:flex-row justify-between gap-10">

          {/* LEFT */}
          <div className="max-w-sm">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              CoworkSpace
            </h2>

            <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">
              Manage your workspaces, collaborate with your team, and stay productive —
              all in one powerful platform.
            </p>
          </div>

          {/* RIGHT LINKS */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">

            {/* COLUMN 1 */}
            <div>
              <p className="text-[var(--text-primary)] font-medium mb-3">
                Product
              </p>
              <div className="flex flex-col gap-2 text-[var(--text-secondary)]">
                <a
                  href="#"
                  className="hover:text-[var(--accent)] transition"
                >
                  Features
                </a>
                <a
                  href="#"
                  className="hover:text-[var(--accent)] transition"
                >
                  Pricing
                </a>
              </div>
            </div>

            {/* COLUMN 2 */}
            <div>
              <p className="text-[var(--text-primary)] font-medium mb-3">
                Company
              </p>
              <div className="flex flex-col gap-2 text-[var(--text-secondary)]">
                <a
                  href="#"
                  className="hover:text-[var(--accent)] transition"
                >
                  About
                </a>
                <a
                  href="#"
                  className="hover:text-[var(--accent)] transition"
                >
                  Contact
                </a>
              </div>
            </div>

            {/* COLUMN 3 */}
            <div>
              <p className="text-[var(--text-primary)] font-medium mb-3">
                Legal
              </p>
              <div className="flex flex-col gap-2 text-[var(--text-secondary)]">
                <a
                  href="#"
                  className="hover:text-[var(--accent)] transition"
                >
                  Privacy
                </a>
                <a
                  href="#"
                  className="hover:text-[var(--accent)] transition"
                >
                  Terms
                </a>
              </div>
            </div>

          </div>

        </div>

        {/* 🔥 BOTTOM */}
        <div className="mt-10 pt-6 border-t border-[var(--border)] 
                        flex flex-col sm:flex-row justify-between items-center 
                        gap-4 text-xs text-[var(--text-secondary)]">

          <p>© 2026 CoworkSpace. All rights reserved.</p>

          {/* 🔥 SOCIALS */}
          <div className="flex gap-4">
            <span className="hover:text-[var(--accent)] cursor-pointer transition">
              Twitter
            </span>
            <span className="hover:text-[var(--accent)] cursor-pointer transition">
              LinkedIn
            </span>
            <span className="hover:text-[var(--accent)] cursor-pointer transition">
              GitHub
            </span>
          </div>

        </div>

      </div>
    </footer>
  );
}