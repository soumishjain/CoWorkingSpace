import { Link } from "react-router-dom";

const RegisterForm = ({
  formData,
  onChange,
  onFileChange,
  onSubmit,
  loading,
  error,
}) => {
  return (
    <div className="min-h-screen flex flex-row-reverse">

      {/* 🔥 LEFT SIDE */}
      <div className="hidden md:flex w-1/2 relative overflow-hidden 
                      bg-gradient-to-br 
                      from-[var(--accent)] 
                      via-[#FF8C42] 
                      to-[#FFA366] 
                      text-white items-center justify-center p-10">

        {/* GLOW BLOBS */}
        <div className="absolute w-80 h-80 bg-white/10 rounded-full blur-3xl top-0 left-0 animate-pulse"></div>
        <div className="absolute w-80 h-80 bg-black/20 rounded-full blur-3xl bottom-0 right-0 animate-pulse"></div>

        <div className="relative z-10 max-w-md">

          <h1 className="text-4xl font-bold leading-tight">
            Build. Track. <br /> Dominate 🚀
          </h1>

          <p className="mt-4 text-white/80 text-sm leading-relaxed">
            Turn your ideas into execution. Manage tasks, collaborate seamlessly,
            and stay ahead with a powerful workspace.
          </p>

          {/* TASK CARDS */}
          <div className="mt-10 space-y-4">

            <div className="bg-white/10 backdrop-blur-lg p-4 rounded-xl border border-white/20 shadow-xl hover:-translate-y-1 transition">
              <div className="flex justify-between text-xs">
                <span>UI Revamp</span>
                <span className="text-green-300">✔</span>
              </div>
              <div className="mt-2 h-2 bg-white/20 rounded-full">
                <div className="h-2 w-3/4 bg-white rounded-full"></div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg p-4 rounded-xl border border-white/20 shadow-xl hover:-translate-y-1 transition ml-6">
              <div className="flex justify-between text-xs">
                <span>Backend Fix</span>
                <span className="text-yellow-300">⏳</span>
              </div>
              <div className="mt-2 h-2 bg-white/20 rounded-full">
                <div className="h-2 w-1/2 bg-white rounded-full"></div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg p-4 rounded-xl border border-white/20 shadow-xl hover:-translate-y-1 transition">
              <div className="flex justify-between text-xs">
                <span>Deploy 🚀</span>
                <span className="text-blue-300">In Progress</span>
              </div>
              <div className="mt-2 h-2 bg-white/20 rounded-full">
                <div className="h-2 w-2/3 bg-white rounded-full"></div>
              </div>
            </div>

          </div>
        </div>

        {/* GRID */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      {/* 🔥 RIGHT SIDE */}
      <div className="flex w-full md:w-1/2 items-center justify-center 
                      bg-[var(--bg-main)] px-6 relative">

        {/* GLOW */}
        <div className="absolute w-72 h-72 bg-[var(--accent)] rounded-full blur-3xl opacity-10 top-10 right-10"></div>
        <div className="absolute w-72 h-72 bg-[var(--accent)] rounded-full blur-3xl opacity-10 bottom-10 left-10"></div>

        <div className="relative w-full max-w-md">

          {/* HEADER */}
          <div className="mb-8 text-left">
            <h1 className="text-3xl font-semibold text-[var(--text-primary)]">
              Create account ✨
            </h1>
            <p className="text-[var(--text-secondary)] text-sm mt-1">
              Let’s get you started
            </p>
          </div>

          {/* CARD */}
          <div className="bg-[var(--bg-secondary)]/70 backdrop-blur-xl 
                          border border-[var(--border)] 
                          shadow-2xl rounded-3xl p-8">

            <form onSubmit={onSubmit} className="space-y-4">

              <input
                name="name"
                value={formData.name}
                onChange={onChange}
                placeholder="Full Name"
                className="input "
              />

              <input
                name="email"
                value={formData.email}
                onChange={onChange}
                placeholder="Email"
                className="input "
              />

              <input
                name="username"
                value={formData.username}
                onChange={onChange}
                placeholder="Username"
                className="input "
              />

              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={onChange}
                placeholder="Password"
                className="input "
              />

              <input
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={onChange}
                placeholder="Confirm Password"
                className="input "
              />

              {/* FILE */}
              <label className="flex items-center justify-between px-4 py-3 
                                border border-dashed border-[var(--border)] 
                                rounded-xl cursor-pointer 
                                hover:bg-[var(--bg-hover)] 
                                text-sm text-[var(--text-secondary)] transition">
                <span>Upload Profile</span>
                <span>📷</span>
                <input
                  type="file"
                  onChange={onFileChange}
                  className="hidden"
                />
              </label>

              {/* ERROR */}
              {error && (
                <p className="text-red-400 text-sm bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20">
                  {error}
                </p>
              )}

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-medium text-white 
                           bg-[var(--accent)] 
                           hover:bg-[var(--accent-soft)] 
                           hover:shadow-[0_0_20px_var(--accent-glow)] 
                           transition-all duration-300"
              >
                {loading ? "Creating..." : "Create Account"}
              </button>

            </form>

            {/* DIVIDER */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-[var(--border)]"></div>
              <span className="px-3 text-xs text-[var(--text-secondary)]">OR</span>
              <div className="flex-1 border-t border-[var(--border)]"></div>
            </div>

            {/* LOGIN */}
            <p className="text-center text-sm text-[var(--text-secondary)]">
              Already have an account?
              <Link
                to="/login"
                className="ml-1 text-[var(--accent)] hover:underline font-medium"
              >
                Login
              </Link>
            </p>

          </div>
        </div>
      </div>

    </div>
  );
};

export default RegisterForm;