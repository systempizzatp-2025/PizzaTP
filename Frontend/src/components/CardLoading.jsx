import React from "react";

const CardLoading = () => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md animate-pulse">

      <div className="h-56 bg-gray-200 relative"></div>

      <div className="p-4">
 
        <div className="h-4 bg-gray-300 rounded w-2/4 mb-3"></div>
        <div className="h-4 bg-gray-300 rounded w-full mb-3"></div>

  
        <div className="flex gap-2 mb-3">
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
};

export default CardLoading;
