const VerifyEmail = ({email}) => {

 return (

  <div className="min-h-screen flex items-center justify-center bg-gray-50">

   <div className="bg-white shadow-lg rounded-xl p-8 text-center w-full max-w-md">

    <h2 className="text-2xl font-bold mb-4">
      Verify your email
    </h2>

    <p className="text-gray-600 mb-4">
      We sent a verification link to
    </p>

    <p className="font-semibold mb-6">
      {email}
    </p>

    <p className="text-sm text-gray-500">
      Please check your inbox and click the link to activate your account.
    </p>

   </div>

  </div>

 )

}

export default VerifyEmail