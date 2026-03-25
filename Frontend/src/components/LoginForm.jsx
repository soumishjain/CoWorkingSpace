import { Link } from "react-router-dom";

const LoginForm = ({
  formData,
  onChange,
  onSubmit,
  loading,
  error,
}) => {
  return (
    <div className="min-h-screen flex">

      {/* 🔥 LEFT SIDE (BRAND / VISUAL) */}
<div className="hidden md:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 text-white items-center justify-center p-10">

  {/* 🔥 ANIMATED GLOW BLOBS */}
  <div className="absolute w-80 h-80 bg-white/10 rounded-full blur-3xl top-0 left-0 animate-pulse"></div>
  <div className="absolute w-80 h-80 bg-pink-400/20 rounded-full blur-3xl bottom-0 right-0 animate-pulse"></div>

  {/* 🔥 CONTENT */}
  <div className="relative z-10 max-w-md">

    <h1 className="text-4xl font-bold leading-tight">
      Build. Track. <br /> Dominate 🚀
    </h1>

    <p className="mt-4 text-indigo-100 text-sm leading-relaxed">
      Turn your ideas into execution. Manage tasks, collaborate seamlessly,
      and stay ahead with a powerful workspace.
    </p>

    {/* 🔥 FLOATING TASK CARDS */}
    <div className="mt-10 space-y-4">

      <div className="bg-white/10 backdrop-blur-lg p-4 rounded-xl border border-white/20 shadow-xl transform hover:-translate-y-1 transition duration-300">
        <div className="flex justify-between text-xs">
          <span>UI Revamp</span>
          <span className="text-green-300">✔</span>
        </div>
        <div className="mt-2 h-2 bg-white/20 rounded-full">
          <div className="h-2 w-3/4 bg-white rounded-full"></div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-lg p-4 rounded-xl border border-white/20 shadow-xl transform hover:-translate-y-1 transition duration-300 ml-6">
        <div className="flex justify-between text-xs">
          <span>Backend Fix</span>
          <span className="text-yellow-300">⏳</span>
        </div>
        <div className="mt-2 h-2 bg-white/20 rounded-full">
          <div className="h-2 w-1/2 bg-white rounded-full"></div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-lg p-4 rounded-xl border border-white/20 shadow-xl transform hover:-translate-y-1 transition duration-300">
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

  {/* 🔥 GRID OVERLAY (PRO TOUCH) */}
  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

</div>

      {/* 🔥 RIGHT SIDE (FORM) */}
<div className="flex w-full md:w-1/2 items-center justify-center bg-gray-50 px-6 relative overflow-hidden">

  {/* 🔥 SUBTLE BACKGROUND GLOW */}
  <div className="absolute w-72 h-72 bg-indigo-200 rounded-full blur-3xl opacity-30 top-10 right-10"></div>
  <div className="absolute w-72 h-72 bg-purple-200 rounded-full blur-3xl opacity-30 bottom-10 left-10"></div>

  <div className="relative w-full max-w-md">

    {/* 🔥 HEADER */}
    <div className="mb-8">
      <h1 className="text-3xl font-semibold text-gray-900">
        Welcome back 👋
      </h1>
      <p className="text-gray-500 mt-1 text-sm">
        Let’s get you back inside your workspace
      </p>
    </div>

    {/* 🔥 CARD */}
    <div className="bg-white/70 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-3xl p-8">

      <form onSubmit={onSubmit} className="space-y-6">

        {/* EMAIL */}
        <div className="relative">
          <label className="text-xs text-gray-500">
            Email
          </label>

          <input
            name="identifier"
            placeholder="you@example.com"
            value={formData.identifier}
            onChange={onChange}
            className="w-full mt-1 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-sm"
          />
        </div>

        {/* PASSWORD */}
        <div className="relative">
          <label className="text-xs text-gray-500">
            Password
          </label>

          <input
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={onChange}
            className="w-full mt-1 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-sm"
          />
        </div>

        {/* ERROR */}
        {error && (
          <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        {/* 🔥 BUTTON (HERO ELEMENT) */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl font-medium text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

      </form>

      {/* DIVIDER */}
      <div className="flex items-center my-6">
        <div className="flex-1 border-t border-gray-200"></div>
        <span className="px-3 text-xs text-gray-400">OR</span>
        <div className="flex-1 border-t border-gray-200"></div>
      </div>

      {/* REGISTER */}
      <p className="text-center text-sm text-gray-600">
        Don't have an account?
        <Link
          to="/register"
          className="ml-1 text-indigo-600 hover:text-indigo-700 font-medium"
        >
          Create account
        </Link>
      </p>

    </div>
  </div>
</div>

    </div>
  );
};

export default LoginForm;