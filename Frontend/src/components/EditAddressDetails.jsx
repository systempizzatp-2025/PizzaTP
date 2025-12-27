import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/AxiosUser";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import { useGlobalContext } from "../provider/GlobalProvider";

const EditAddressDetails = ({ close, data }) => {
  const { register, handleSubmit, setValue, reset, watch } = useForm({
    defaultValues: {
      _id: data._id,
      userId: data.userId,
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

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const { fetchAddress } = useGlobalContext();

  const selectedCity = watch("city");
  const selectedDistrict = watch("district");


  // API ESGOO
  useEffect(() => {
    axios
      .get("https://esgoo.net/api-tinhthanh/1/0.htm")
      .then((res) => setProvinces(res.data.data))
      .catch((err) => console.log(err));
  }, []);


  useEffect(() => {
    if (!selectedCity) return;

    const province = provinces.find((p) => p.name === selectedCity);
    if (!province) return;

    axios
      .get(`https://esgoo.net/api-tinhthanh/2/${province.id}.htm`)
      .then((res) => setDistricts(res.data.data))
      .catch((err) => console.log(err));
  }, [selectedCity, provinces]);


  useEffect(() => {
    if (!selectedDistrict) return;

    const district = districts.find((d) => d.name === selectedDistrict);
    if (!district) return;

    axios
      .get(`https://esgoo.net/api-tinhthanh/3/${district.id}.htm`)
      .then((res) => setWards(res.data.data))
      .catch((err) => console.log(err));
  }, [selectedDistrict, districts]);

  const onSubmit = async (formData) => {
    try {
      const response = await Axios({
        ...SummaryApi.updateAddress,
        data: formData,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        close();
        reset();
        fetchAddress();
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

        <h2 className="text-xl font-semibold mb-6">Chỉnh sửa địa chỉ</h2>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>

          <div>
            <label className="block mb-1 font-medium">Họ và tên:</label>
            <input
              type="text"
              className="border rounded w-full p-2"
              {...register("fullName", { required: true })}
            />
          </div>


          <div>
            <label className="block mb-1 font-medium">Số điện thoại:</label>
            <input
              type="text"
              className="border rounded w-full p-2"
              {...register("phoneNumber", { required: true })}
            />
          </div>


          <div>
            <label className="block mb-1 font-medium">Số nhà, đường:</label>
            <input
              type="text"
              className="border rounded w-full p-2"
              {...register("street", { required: true })}
            />
          </div>


          <div>
            <label className="block mb-1 font-medium">Mã bưu chính:</label>
            <input
              type="text"
              className="border rounded w-full p-2"
              {...register("postalCode", { required: true })}
            />
          </div>


          <div>
            <label className="block mb-1 font-medium">Thành phố / Tỉnh:</label>
            <select
              value={selectedCity}
              className="border rounded w-full p-2"
              {...register("city", { required: true })}
              onChange={(e) => {
                setValue("city", e.target.value);
                setValue("district", "");
                setValue("ward", "");
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
              value={selectedDistrict}
              className="border rounded w-full p-2"
              {...register("district", { required: true })}
              disabled={districts.length === 0}
              onChange={(e) => {
                setValue("district", e.target.value);
                setValue("ward", "");
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
              value={watch("ward")}
              className="border rounded w-full p-2"
              {...register("ward", { required: true })}
              disabled={wards.length === 0}
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
              className="border rounded w-full p-2"
              {...register("country")}
            />
          </div>


          <div>
            <label className="block mb-1 font-medium">Ghi chú:</label>
            <input
              type="text"
              className="border rounded w-full p-2"
              {...register("notes")}
            />
          </div>


          <div>
            <label className="block mb-1 font-medium">Loại địa chỉ:</label>
            <select
              className="border rounded w-full p-2"
              {...register("label")}
            >
              <option value="Home">Nhà riêng</option>
              <option value="Work">Cơ quan</option>
              <option value="Other">Khác</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-red-500 text-white w-full py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
          >
            Xác nhận
          </button>
        </form>
      </div>
    </section>
  );
};

export default EditAddressDetails;
