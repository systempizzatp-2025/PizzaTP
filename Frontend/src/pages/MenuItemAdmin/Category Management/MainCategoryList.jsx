import React, { useEffect, useState } from "react";
import UploadCategoryModel from "../../../components/CategoryModel/UploadCategoryModel";
import Loading from "../../../components/Loading";
import NoData from "../../../components/NoData";
import Axios from "../../../utils/AxiosAdmin";
import SummaryApi from "../../../common/SummaryApi";
import EditCategory from "../../../components/CategoryModel/EditCategory";
import ConfirmBox from "../../../components/ConfirmBox";
import toast from "react-hot-toast";
import AxiosToastError from "../../../utils/AxiosToastError";
import { useSelector, useDispatch } from "react-redux";
import { setAllCategory } from "../../../store/productSlice";

const MainCategoryList = () => {
  const dispatch = useDispatch();
  const [openUploadCategory, setOpenUploadCategory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({ name: "", image: "" });
  const [openConfirmBoxDelete, setOpenConfirmBoxDelete] = useState(false);
  const [deleteCategory, setDeleteCategory] = useState({ _id: "" });

  const allCategory = useSelector((state) => state.product.allCategory);

  useEffect(() => {
    setCategoryData(allCategory);
  }, [allCategory]);

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const response = await Axios(SummaryApi.getCategory);
      const { data: responseData } = response;
      if (responseData.success) {
        dispatch(setAllCategory(responseData.data));
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const handleDeleteCategory = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteCategory,
        data: deleteCategory,
      });
      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        await fetchCategory();
        setOpenConfirmBoxDelete(false);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="p-4">
      
      <div className="p-2 bg-white shadow-md flex items-center justify-between">
        <h2 className="font-semibold">Danh mục chính</h2>
        <button
          onClick={() => setOpenUploadCategory(true)}
          className="text-sm border border-primary-100 hover:bg-primary-100 px-3 py-1 rounded"
        >
          Thêm danh mục chính
        </button>
      </div>

   
      {!categoryData.length && !loading && <NoData />}


      <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categoryData.map((category) => (
          <div
            key={category._id}
            className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col items-center p-3 transition hover:shadow-lg"
          >
            <div className="w-full h-32 flex items-center justify-center bg-gray-50 rounded">
              <img
                src={category.image}
                alt={category.name}
                className="object-contain h-full w-full"
              />
            </div>
            <p className="mt-2 text-center font-medium text-gray-700">
              {category.name}
            </p>
            <div className="flex gap-2 mt-3 w-full">
              <button
                onClick={() => {
                  setOpenEdit(true);
                  setEditData(category);
                }}
                className="flex-1 py-1 rounded-lg text-sm font-medium bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
              >
                Sửa
              </button>
              <button
                onClick={() => {
                  setOpenConfirmBoxDelete(true);
                  setDeleteCategory(category);
                }}
                className="flex-1 py-1 rounded-lg text-sm font-medium bg-red-100 text-red-600 hover:bg-red-200 transition"
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>

      {loading && <Loading />}

      {openUploadCategory && (
        <UploadCategoryModel
          fetchData={fetchCategory}
          close={() => setOpenUploadCategory(false)}
        />
      )}

      {openEdit && (
        <EditCategory
          data={editData}
          close={() => setOpenEdit(false)}
          fetchData={fetchCategory}
        />
      )}

      {openConfirmBoxDelete && (
        <ConfirmBox
          close={() => setOpenConfirmBoxDelete(false)}
          cancel={() => setOpenConfirmBoxDelete(false)}
          confirm={handleDeleteCategory}
        />
      )}
    </section>
  );
};

export default MainCategoryList;
