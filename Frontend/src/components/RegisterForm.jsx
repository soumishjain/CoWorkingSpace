import { Link } from "react-router-dom"

const RegisterForm = ({
  formData,
  onChange,
  onFileChange,
  onSubmit,
  loading,
  error
}) => {

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">

      <div className="w-full max-w-md">

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Create your account
          </h1>
          <p className="text-gray-500 mt-2">
            Start collaborating with your team
          </p>
        </div>

        {/* Card */}
        <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100">

          <form onSubmit={onSubmit} className="space-y-5">

            {/* Name */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Full Name
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={onChange}
                placeholder="Enter your name"
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Email
              </label>
              <input
                name="email"
                value={formData.email}
                onChange={onChange}
                placeholder="Enter your email"
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Username */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Username
              </label>
              <input
                name="username"
                value={formData.username}
                onChange={onChange}
                placeholder="Choose a username"
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Password
              </label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={onChange}
                placeholder="Enter password"
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Confirm Password
              </label>
              <input
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={onChange}
                placeholder="Confirm password"
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Profile Image */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Profile Image
              </label>
              <input
                type="file"
                onChange={onFileChange}
                className="w-full mt-1 text-sm"
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-500 text-sm">
                {error}
              </p>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 transition font-medium"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>

          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-3 text-sm text-gray-400">
              OR
            </span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600">
            Already have an account?
            <Link
              to="/login"
              className="ml-1 text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Login
            </Link>
          </p>

        </div>

      </div>

    </div>

  )
}

export default RegisterForm