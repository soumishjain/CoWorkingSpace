import React from "react";

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="relative">
        <div className="w-14 h-14 border-4 border-gray-300 rounded-full"></div>
        <div className="w-14 h-14 border-4 border-black border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
      </div>
      <p className="mt-4 text-gray-600 text-sm tracking-wide">
        Loading workspace...
      </p>
    </div>
  );
};

export default Loader;