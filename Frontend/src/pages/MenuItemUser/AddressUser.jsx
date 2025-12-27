import React, { useState } from "react";
import { useSelector } from "react-redux";
import AddAddress from "../../components/AddAddress";
import { MdDelete, MdEdit, MdLocationOn } from "react-icons/md";
import EditAddressDetails from "../../components/EditAddressDetails";
import AxiosToastError from "../../utils/AxiosToastError";
import Axios from "../../utils/AxiosUser";
import SummaryApi from "../../common/SummaryApi";
import toast from "react-hot-toast";
import { useGlobalContext } from "../../provider/GlobalProvider";

const AddressUser = () => {
  const addressList = useSelector((state) => state.address.addressList);
  const [openAddress, setopenAddress] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({});
  const { fetchAddress } = useGlobalContext();

  const handleDisableAddress = async (id) => {
    try {
      const response = await Axios({
        ...SummaryApi.disableAddress,
        data: { _id: id },
      });
      if (response.data.success) {
        toast.success("Đã xóa địa chỉ");
        if (fetchAddress) fetchAddress();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Địa chỉ của tôi
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Quản lý địa chỉ giao hàng
          </p>
        </div>
        <button
          onClick={() => setopenAddress(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all flex items-center gap-2"
        >
          <span>+</span>
          <span>Thêm địa chỉ mới</span>
        </button>
      </div>

      <div className="p-6 overflow-y-auto max-h-[calc(100vh-220px)] scrollBarCustom">
        {addressList.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <MdLocationOn className="text-gray-400 text-3xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Bạn chưa có địa chỉ nào
            </h3>
            <p className="text-gray-500 mb-6">
              Thêm địa chỉ để nhận hàng nhanh chóng
            </p>
            <button
              onClick={() => setopenAddress(true)}
              className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all"
            >
              Thêm địa chỉ mới
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {addressList.map((address, index) => (
              <div
                key={address._id}
                className={`border rounded-lg p-5 transition-all hover:border-red-300 ${
                  address.isDefault
                    ? "border-red-400 bg-red-50"
                    : "border-gray-200"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          address.isDefault
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {address.isDefault ? "Mặc định" : "Địa chỉ"}
                      </div>
                      <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {address.label}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-20 text-sm text-gray-500 font-medium">
                          Người nhận:
                        </div>
                        <div className="text-gray-800">{address.fullName}</div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-20 text-sm text-gray-500 font-medium">
                          Điện thoại:
                        </div>
                        <div className="text-gray-800">
                          {address.phoneNumber}
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-20 text-sm text-gray-500 font-medium">
                          Địa chỉ:
                        </div>
                        <div className="text-gray-800">
                          {address.street}, {address.ward}, {address.district},{" "}
                          {address.city}
                          {address.postalCode && `, ${address.postalCode}`}
                          {address.country && `, ${address.country}`}
                        </div>
                      </div>
                      {address.notes && (
                        <div className="flex items-start gap-3">
                          <div className="w-20 text-sm text-gray-500 font-medium">
                            Ghi chú:
                          </div>
                          <div className="text-gray-600 italic">
                            {address.notes}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => {
                        setOpenEdit(true);
                        setEditData(address);
                      }}
                      className="p-2 rounded-lg border border-blue-300 
               text-blue-600 hover:bg-blue-50 
               transition-colors flex items-center gap-1 text-sm"
                      title="Chỉnh sửa"
                    >
                      <MdEdit size={18} />
                      <span className="hidden sm:inline">Sửa</span>
                    </button>

                    <button
                      onClick={() => handleDisableAddress(address._id)}
                      className="p-2 rounded-lg border border-red-300 
               text-red-600 hover:bg-red-50 
               transition-colors flex items-center gap-1 text-sm"
                      title="Xóa"
                    >
                      <MdDelete size={18} />
                      <span className="hidden sm:inline">Xóa</span>
                    </button>
                  </div>
                </div>

                {address.isDefault && (
                  <div className="mt-4 pt-4 border-t border-red-200">
                    <div className="flex items-center gap-2 text-red-600">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm font-medium">
                        Địa chỉ mặc định sẽ được sử dụng để giao hàng
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {addressList.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={() => setopenAddress(true)}
              className="px-6 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-700 hover:border-red-400 hover:text-red-600 hover:bg-red-50 transition-all w-full flex items-center justify-center gap-2"
            >
              <span className="text-xl">+</span>
              <span className="font-medium">Thêm địa chỉ mới</span>
            </button>
          </div>
        )}
      </div>

      {openAddress && <AddAddress close={() => setopenAddress(false)} />}
      {openEdit && (
        <EditAddressDetails data={editData} close={() => setOpenEdit(false)} />
      )}
    </div>
  );
};

export default AddressUser;
