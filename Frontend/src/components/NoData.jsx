import React from "react";
import noData from "../assets/no_data_pizza.png";

const NoData = () => {
  return (
    <div className="flex flex-col items-center justify-center p-4 gap-2">
      <img src={noData} alt="no data" className="w-36" />
      <p className="text-neutral-500">Không có dữ liệu</p>
    </div>
  );
};

export default NoData;