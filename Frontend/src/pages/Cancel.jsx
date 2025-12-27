import React from "react";
import { Link } from "react-router-dom";

const Success = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center animate-fadeIn">

        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-20 h-20 text-red-500 mx-auto"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm5 8.5l-6 6a1 1 0 01-1.4 0l-3-3a1 1 0 111.4-1.4l2.3 2.3 5.3-5.3a1 1 0 111.4 1.4z" />
        </svg>

        <p className="text-2xl font-bold mt-4 text-gray-800">
          Thanh toán thất bại
        </p>

        <Link
          to="/"
          className="mt-6 inline-block w-full bg-red-500 text-white font-semibold py-3 rounded-lg hover:bg-red-600 transition-all duration-200"
        >
          Quay về trang chủ
        </Link>
      </div>
    </div>
  );
};

export default Success;
