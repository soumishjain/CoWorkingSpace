export default function Footer() {
  return (
    <footer className="relative mt-28">

      {/* 🔥 TOP GRADIENT LINE (premium touch) */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* 🔥 TOP SECTION */}
        <div className="flex flex-col md:flex-row justify-between gap-10">

          {/* LEFT */}
          <div className="max-w-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              CoworkSpace
            </h2>

            <p className="mt-3 text-sm text-gray-500 leading-relaxed">
              Manage your workspaces, collaborate with your team, and stay productive —
              all in one powerful platform.
            </p>
          </div>

          {/* RIGHT LINKS */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">

            {/* COLUMN 1 */}
            <div>
              <p className="text-gray-900 font-medium mb-3">Product</p>
              <div className="flex flex-col gap-2 text-gray-500">
                <a href="#" className="hover:text-gray-900 transition">Features</a>
                <a href="#" className="hover:text-gray-900 transition">Pricing</a>
              </div>
            </div>

            {/* COLUMN 2 */}
            <div>
              <p className="text-gray-900 font-medium mb-3">Company</p>
              <div className="flex flex-col gap-2 text-gray-500">
                <a href="#" className="hover:text-gray-900 transition">About</a>
                <a href="#" className="hover:text-gray-900 transition">Contact</a>
              </div>
            </div>

            {/* COLUMN 3 */}
            <div>
              <p className="text-gray-900 font-medium mb-3">Legal</p>
              <div className="flex flex-col gap-2 text-gray-500">
                <a href="#" className="hover:text-gray-900 transition">Privacy</a>
                <a href="#" className="hover:text-gray-900 transition">Terms</a>
              </div>
            </div>

          </div>

        </div>

        {/* 🔥 BOTTOM */}
        <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-400">

          <p>© 2026 CoworkSpace. All rights reserved.</p>

          {/* OPTIONAL SOCIALS */}
          <div className="flex gap-4">
            <span className="hover:text-gray-700 cursor-pointer transition">Twitter</span>
            <span className="hover:text-gray-700 cursor-pointer transition">LinkedIn</span>
            <span className="hover:text-gray-700 cursor-pointer transition">GitHub</span>
          </div>

        </div>

      </div>
    </footer>
  );
}