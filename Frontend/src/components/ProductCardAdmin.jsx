import React, { useState } from "react";
import EditProductAdmin from "./EditProductAdmin";
// import ConfirmBox from "./ConfirmBox";
import { IoClose } from "react-icons/io5";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/AxiosAdmin";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";

const ProductCardAdmin = ({ data, fetchProductData }) => {
  const [editOpen, setEditOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const handleDeleteCancel = () => {
    setOpenDelete(false);
  };

  const handleDelete = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteProduct,
        data: {
          _id: data._id,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);

        if (fetchProductData) {
          fetchProductData();
        }
        setOpenDelete(false);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };
  return (
    <div className="bg-white shadow hover:shadow-lg rounded-xl p-4 transition flex flex-col">
      <div className="w-full h-32 flex items-center justify-center overflow-hidden rounded-lg bg-gray-50">
        <img
          src={data?.image?.[0]}
          alt={data?.name}
          className="object-contain w-full h-full"
        />
      </div>

      <p className="mt-3 font-semibold text-gray-800 text-[15px] whitespace-nowrap overflow-hidden text-ellipsis">
        {data?.name}
      </p>

      {data?.type && (
        <p className="mt-1 text-xs text-gray-500">
          <span className="font-semibold text-gray-700">Loại:</span> {data.type}
        </p>
      )}

      {/* {data?.sizes?.length > 0 && (
        <p className="mt-1 text-xs text-gray-500">
          <span className="font-semibold text-gray-700">Size:</span>{" "}
          {data.sizes.map((s) => s.name).join(", ")}
        </p>
      )} */}

      <div className="flex gap-2 mt-3 w-full">
        <button
          onClick={() => setEditOpen(true)}
          className="flex-1 py-1 rounded-lg text-sm font-medium bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
        >
          Sửa
        </button>
        <button
          onClick={() => setOpenDelete(true)}
          className="flex-1 py-1 rounded-lg text-sm font-medium bg-red-100 text-red-600 hover:bg-red-200 transition"
        >
          Xóa
        </button>
      </div>

      {editOpen && (
        <EditProductAdmin
          fetchProductData={fetchProductData}
          data={data}
          close={() => setEditOpen(false)}
        />
      )}

      {/* <ConfirmBox /> */}

      {openDelete && (
        <section className="fixed top-0 bottom-0 left-0 right-0 z-50 bg-neutral-800 bg-opacity-70 p-4 flex justify-center items-center">
          <div className="bg-white w-full max-w-md p-4 rounded">
            <div className="flex justify-between items-center gap-3">
              <h3 className="font-semibold">Xóa vĩnh viễn</h3>
              <button onClick={() => setOpenDelete(false)}>
                <IoClose size={25} />
              </button>
            </div>
            <p className="my-4">Bạn chắc chắn muốn xóa sản phẩm này chứ?</p>
            <div className="w-fit ml-auto flex items-center gap-3">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-1 border rounded border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              >
                Thoát
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-1 border rounded border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductCardAdmin;
