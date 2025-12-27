import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/AxiosUser";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import { useGlobalContext } from "../provider/GlobalProvider";

const AddAddress = ({ close }) => {
  const { register, handleSubmit, setValue, reset } = useForm();

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvinceId, setSelectedProvinceId] = useState(null);
  const [selectedDistrictId, setSelectedDistrictId] = useState(null);
  const { fetchAddress } = useGlobalContext();


  // API ESGOO
  useEffect(() => {
    axios
      .get("https://esgoo.net/api-tinhthanh/1/0.htm")
      .then((res) => setProvinces(res.data.data))
      .catch((err) => console.log( err));
  }, []);

  useEffect(() => {
    if (!selectedProvinceId) return;
    axios
      .get(`https://esgoo.net/api-tinhthanh/2/${selectedProvinceId}.htm`)
      .then((res) => setDistricts(res.data.data))
      .catch((err) => console.log( err));
  }, [selectedProvinceId]);

  useEffect(() => {
    if (!selectedDistrictId) return;
    axios
      .get(`https://esgoo.net/api-tinhthanh/3/${selectedDistrictId}.htm`)
      .then((res) => setWards(res.data.data))
      .catch((err) => console.log(err));
  }, [selectedDistrictId]);

  const onSubmit = async (data) => {

    try {
      const response = await Axios({
        ...SummaryApi.createAddress,
        data: {
          user: data.user,
          label: data.label,
          fullName: data.fullName,
          phoneNumber: data.phoneNumber,
          street: data.street,
          ward: data.ward,
          district: data.district,
          city: data.city,
          country: data.country,
          postalCode: data.postalCode,
          isDefault: data.isDefault,
          notes: data.notes,
        },
      });
      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        if (close) {
          close();
          reset();
          fetchAddress();
        }
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-start sm:items-center overflow-y-auto scrollBarCustom">
      <div className="bg-white w-full max-w-lg sm:rounded mt-8 sm:mt-16 mx-4 sm:mx-auto p-6 sm:p-8 overflow-y-auto max-h-[105vh] relative scrollBarCustom">
        <button
          onClick={close}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
        >
          <IoClose size={25} />
        </button>

        <h2 className="text-xl font-semibold mb-6">Thêm địa chỉ mới</h2>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      
          <div>
            <label className="block mb-1 font-medium">Họ và tên:</label>
            <input
              type="text"
              className="border rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-primary-100"
              {...register("fullName", { required: true })}
            />
          </div>

 
          <div>
            <label className="block mb-1 font-medium">Số điện thoại:</label>
            <input
              type="text"
              className="border rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-primary-100"
              {...register("phoneNumber", { required: true })}
            />
          </div>

  
          <div>
            <label className="block mb-1 font-medium">Số nhà, đường:</label>
            <input
              type="text"
              className="border rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-primary-100"
              {...register("street", { required: true })}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Mã bưu chính:</label>
            <input
              type="text"
              className="border rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-primary-100"
              {...register("postalCode", { required: true })}
            />
          </div>

 
          <div>
            <label className="block mb-1 font-medium">Thành phố / Tỉnh:</label>
            <select
              className="border rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-primary-100"
              {...register("city", { required: true })}
              onChange={(e) => {
                const provinceName = e.target.value;
                const province = provinces.find((p) => p.name === provinceName);
                setValue("city", provinceName);
                setSelectedProvinceId(province.id);
                setDistricts([]);
                setWards([]);
              }}
            >
              <option value="">Chọn tỉnh</option>
              {provinces.map((item) => (
                <option key={item.id} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>


          <div>
            <label className="block mb-1 font-medium">Quận / Huyện:</label>
            <select
              className="border rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-primary-100"
              {...register("district", { required: true })}
              disabled={districts.length === 0}
              onChange={(e) => {
                const districtName = e.target.value;
                const district = districts.find((d) => d.name === districtName);
                setValue("district", districtName);
                setSelectedDistrictId(district.id);
                setWards([]);
              }}
            >
              <option value="">Chọn quận/huyện</option>
              {districts.map((item) => (
                <option key={item.id} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>


          <div>
            <label className="block mb-1 font-medium">Phường / Xã:</label>
            <select
              className="border rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-primary-100"
              {...register("ward", { required: true })}
              disabled={wards.length === 0}
              onChange={(e) => setValue("ward", e.target.value)}
            >
              <option value="">Chọn phường/xã</option>
              {wards.map((item) => (
                <option key={item.id} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>


          <div>
            <label className="block mb-1 font-medium">Quốc gia:</label>
            <input
              type="text"
              defaultValue=""
              className="border rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-primary-100"
              {...register("country")}
            />
          </div>


          <div>
            <label className="block mb-1 font-medium">Ghi chú:</label>
            <input
              type="text"
              className="border rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-primary-100"
              {...register("notes")}
            />
          </div>


          <div>
            <label className="block mb-1 font-medium">Loại địa chỉ:</label>
            <select
              className="border rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-primary-100"
              {...register("label")}
            >
              <option value="Home">Nhà riêng</option>
              <option value="Work">Cơ quan</option>
              <option value="Other">Khác</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-primary-100 text-white w-full py-2 rounded font-semibold hover:bg-primary-200 transition"
          >
            Xác nhận
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddAddress;
