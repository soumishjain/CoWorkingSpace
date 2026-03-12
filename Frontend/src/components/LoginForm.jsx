import { Link } from "react-router-dom"

const LoginForm = ({
 formData,
 onChange,
 onSubmit,
 loading,
 error
}) => {

 return (

 <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">

  <div className="w-full max-w-md">

   {/* Logo / Title */}
   <div className="text-center mb-8">
    <h1 className="text-3xl font-bold text-gray-900">
     Welcome back
    </h1>
    <p className="text-gray-500 mt-2">
     Login to your workspace
    </p>
   </div>

   {/* Card */}
   <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100">

    <form onSubmit={onSubmit} className="space-y-5">

     {/* Email */}
     <div>
      <label className="text-sm font-medium text-gray-600">
       Email
      </label>

      <input
       name="identifier"
       placeholder="Enter your email"
       value={formData.identifier}
       onChange={onChange}
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
       placeholder="Enter your password"
       value={formData.password}
       onChange={onChange}
       className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
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
      {loading ? "Logging in..." : "Login"}
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

    {/* Register */}
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

 )

}

export default LoginForm