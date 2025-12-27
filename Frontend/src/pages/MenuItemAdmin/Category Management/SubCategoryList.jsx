import React, { useState, useEffect } from "react"; 
import UploadSubCategoryModel from "../../../components/SubCategoryModel/UploadSubCategoryModel";
import { useDispatch } from "react-redux"; 
import Axios from "../../../utils/AxiosAdmin";
import SummaryApi from "../../../common/SummaryApi";
import { setAllCategory } from "../../../store/productSlice"; 
import AxiosToastError from "../../../utils/AxiosToastError";
import DisplayTableSubCategory from "../../../components/DisplayTableSubCategory";
import { createColumnHelper } from "@tanstack/react-table";
import ViewImage from "../../../components/ViewImage";
import { LuPencil } from "react-icons/lu";
import { MdOutlineDelete } from "react-icons/md";
import EditSubcategory from "../../../components/EditSubcategory";
import ConfirmBox from "../../../components/ConfirmBox";
import toast from "react-hot-toast";

const SubCategoryList = ({ close }) => {
  const [openAddSubCategory, setOpenAddSubCategory] = useState(false);
  const dispatch = useDispatch(); 
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const columnHelper = createColumnHelper();
  const [ImageURL, setImageURL] = useState("");
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({
    _id: "",
  });

  const [deleteSubCategory, setDeleteSubCategory] = useState({
    _id: "",
  });

  const [openDeleteConfirmBox, setOpenDeleteConfirmBox] = useState(false);

  const fetchCategory = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getCategory,
      });
      const { data: responseData } = response;
      if (responseData.success) {
        dispatch(setAllCategory(responseData.data)); 
      }
    } catch (error) {
      console.error("Lỗi fetch category trong SubCategoryList:", error);
    }
  };

  const fetchSubcategory = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getSubCategory,
      });
      const { data: responseData } = response;

      if (responseData.success) {
        setData(responseData.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const column = [
    columnHelper.accessor("name", {
      header: "Tên danh mục phụ",
    }),
    columnHelper.accessor("image", {
      header: "Hình ảnh danh mục phụ",
      cell: ({ row }) => {
        return (
          <div className="flex justify-center items-center">
            <img
              src={row.original.image}
              alt={row.original.name}
              className="w-8 h-full"
              onClick={() => {
                setImageURL(row.original.image);
              }}
            />
          </div>
        );
      },
    }),
    columnHelper.accessor("category", {
      header: "Danh mục chính",
      cell: ({ row }) => {
        return (
          <>
            {row.original.category.map((c, index) => {
              return (
                <p
                  key={c._id + "table"}
                  className="shadow-md px-1 inline-block"
                >
                  {c.name}
                </p>
              );
            })}
          </>
        );
      },
    }),
    columnHelper.accessor("_id", {
      header: "Hành động",
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setOpenEdit(true);
                setEditData(row.original);
              }}
              className="p-2 bg-blue-100 rounded-full text-blue-500 hover:text-blue-600"
            >
              <LuPencil size={20} />
            </button>
            <button
              onClick={() => {
                setOpenDeleteConfirmBox(true);
                setDeleteSubCategory(row.original);
              }}
              className="p-2 bg-red-100 rounded-full text-red-500 hover:text-red-600"
            >
              <MdOutlineDelete size={20} />
            </button>
          </div>
        );
      },
    }),
  ];

  const handleDeleteSubCategory = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteSubCategory,
        data: deleteSubCategory,
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        fetchSubcategory();
        setOpenDeleteConfirmBox(false);
        setDeleteSubCategory({ _id: "" });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  useEffect(() => {
    fetchCategory();
    fetchSubcategory();
  }, []);
  return (
    <section>
      <div className="p-2 bg-white shadow-md flex items-center justify-between">
        <h2 className="font-semibold">Danh mục phụ</h2>
        <button
          onClick={() => setOpenAddSubCategory(true)}
          className="text-sm border border-primary-100 hover:bg-primary-100 px-3 py-1 rounded"
        >
          Thêm danh mục phụ
        </button>
      </div>

      <div>
        <DisplayTableSubCategory data={data} column={column} />
      </div>
      {openAddSubCategory && (
        <UploadSubCategoryModel
          close={() => setOpenAddSubCategory(false)}
          fetchData={fetchSubcategory}
        />
      )}

      {ImageURL && <ViewImage url={ImageURL} close={() => setImageURL("")} />}

      {openEdit && (
        <EditSubcategory
          data={editData}
          close={() => setOpenEdit(false)}
          fetchData={fetchSubcategory}
        />
      )}

      {openDeleteConfirmBox && (
        <ConfirmBox
          cancel={() => setOpenDeleteConfirmBox(false)}
          close={() => setOpenDeleteConfirmBox(false)}
          confirm={handleDeleteSubCategory}
        />
      )}
    </section>
  );
};

export default SubCategoryList;
