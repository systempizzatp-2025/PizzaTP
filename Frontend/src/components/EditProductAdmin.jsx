import React, { useState, useEffect } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import uploadImage from "../utils/UploadImage";
import Loading from "../components/Loading";
import ViewImage from "../components/ViewImage";
import { setAllCategory, setAllSubCategory } from "../store/productSlice";
import Axios from "../utils/AxiosAdmin";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import { IoClose } from "react-icons/io5";
import AddFieldComponent from "../components/AddFieldComponent";
import successAlert from "../utils/SuccessAlert";

const EditProductAdmin = ({ close, data: propsData, fetchProductData }) => {
  const dispatch = useDispatch();

  const allCategory = useSelector((state) => state.product.allCategory);
  const allSubCategory = useSelector((state) => state.product.allSubCategory);

  const [data, setData] = useState({
    _id: propsData._id,
    ...propsData,
    category: [],
    subCategory: [],
  });

  const [imageLoading, setImageLoading] = useState(false);
  const [ViewImageURL, setViewImageURL] = useState("");
  const [loadingCategory, setLoadingCategory] = useState(false);
  const [loadingSubCategory, setLoadingSubCategory] = useState(false);
  const [selectSubCategory, setSelectSubCategory] = useState("");
  const [openAddField, setOpenAddField] = useState(false);
  const [fieldName, setFieldName] = useState("");

  // Cập nhật category/subCategory khi allCategory/allSubCategory được load - amen
  useEffect(() => {
    setData((prev) => ({
      ...prev,
      category: propsData.category.map(
        (catId) =>
          allCategory.find((c) => c._id === catId) || { _id: catId, name: "" }
      ),
      subCategory: propsData.subCategory.map(
        (subId) =>
          allSubCategory.find((sc) => sc._id === subId) || {
            _id: subId,
            name: "",
          }
      ),
    }));
  }, [allCategory, allSubCategory, propsData]);

  const getFilteredSubCategories = () => {
    if (data.category.length === 0) return [];
    const selectedCategoryIds = data.category.map((cat) => cat._id);
    return allSubCategory.filter((subCat) =>
      subCat.category.some((cat) => selectedCategoryIds.includes(cat._id))
    );
  };

  const fetchCategory = async () => {
    try {
      setLoadingCategory(true);
      const response = await Axios({ ...SummaryApi.getCategory });
      const { data: responseData } = response;
      if (responseData.success) {
        dispatch(setAllCategory(responseData.data));
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoadingCategory(false);
    }
  };

  const fetchSubCategory = async () => {
    try {
      setLoadingSubCategory(true);
      const response = await Axios({ ...SummaryApi.getSubCategory });
      const { data: responseData } = response;
      if (responseData.success) {
        dispatch(setAllSubCategory(responseData.data));
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoadingSubCategory(false);
    }
  };

  useEffect(() => {
    fetchCategory();
    fetchSubCategory();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageLoading(true);
    try {
      const ImageResponse = await uploadImage(file);
      const imageUrl = ImageResponse.data.secure_url || ImageResponse.data.url;
      setData((prev) => ({ ...prev, image: [...prev.image, imageUrl] }));
    } catch (error) {
      console.error("Lỗi tải hình ảnh:", error);
    } finally {
      setImageLoading(false);
    }
  };

  const handleDeleteImage = (index) => {
    const newImages = [...data.image];
    newImages.splice(index, 1);
    setData((prev) => ({ ...prev, image: newImages }));
  };

  const handleAddCategory = (categoryId) => {
    if (!categoryId) return;
    const categoryDetails = allCategory.find((c) => c._id === categoryId);
    if (!categoryDetails) return;
    if (!data.category.some((c) => c._id === categoryId)) {
      setData((prev) => ({
        ...prev,
        category: [...prev.category, categoryDetails],
      }));
    }
  };

  const handleDeleteCategory = (categoryId) => {
    const updatedCategories = data.category.filter(
      (cat) => cat._id !== categoryId
    );
    const remainingCategoryIds = updatedCategories.map((cat) => cat._id);
    const updatedSubCategories = data.subCategory.filter((subCat) =>
      subCat.category.some((cat) => remainingCategoryIds.includes(cat._id))
    );

    setData((prev) => ({
      ...prev,
      category: updatedCategories,
      subCategory: updatedSubCategories,
    }));
  };

  const handleAddSubCategory = (subCategoryId) => {
    if (!subCategoryId) return;
    const subCategory = allSubCategory.find((el) => el._id === subCategoryId);
    if (!subCategory) return;
    if (!data.subCategory.some((subCat) => subCat._id === subCategoryId)) {
      setData((prev) => ({
        ...prev,
        subCategory: [...prev.subCategory, subCategory],
      }));
      setSelectSubCategory("");
    }
  };

  const handleDeleteSubCategory = (subCategoryId) => {
    setData((prev) => ({
      ...prev,
      subCategory: prev.subCategory.filter(
        (subCat) => subCat._id !== subCategoryId
      ),
    }));
  };

  const filteredSubCategories = getFilteredSubCategories();

  const handleAddField = () => {
    setData((prev) => ({
      ...prev,
      more_details: {
        ...prev.more_details,
        [fieldName]: "",
      },
    }));
    setFieldName("");
    setOpenAddField(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios({
        ...SummaryApi.updateProductDetails,
        data: data,
      });
      const { data: responseData } = response;

      if (responseData.success) {
        successAlert(responseData.message);
        if (close) {
          close();
        }
        fetchProductData();
        setData({
          name: "",
          image: [],
          category: [],
          subCategory: [],
          price: "",
          discount: "",
          description: "",
          more_details: {},
          type: "",
          sizes: [],
          bases: [],
        });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };
  return (
    <section className="fixed top-0 right-0 left-0 bottom-0 bg-black z-50 bg-opacity-70 flex items-center justify-center">
      <div className="bg-white w-full p-4 max-w-2xl mx-auto rounded overflow-y-auto scrollBarCustom max-h-[95vh] h-full">
        <section>
          <div className="p-2 bg-white shadow-md flex items-center justify-between">
            <h2 className="font-semibold">Thêm sản phẩm</h2>
            <button onClick={close}>
              <IoClose size={20} />
            </button>
          </div>

          <div className="grid p-3">
            <form className="grid gap-4" onSubmit={handleSubmit}>
              <div className="grid gap-1">
                <label htmlFor="name" className="font-semibold">
                  Tên
                </label>
                <input
                  type="text"
                  placeholder="Nhập tên sản phẩm"
                  value={data.name}
                  onChange={handleChange}
                  id="name"
                  name="name"
                  required
                  className="bg-blue-50 p-2 outline-none border focus-within:border-primary-100"
                />
              </div>

              <div className="grid gap-1">
                <label htmlFor="description" className="font-semibold">
                  Mô tả sản phẩm
                </label>
                <textarea
                  placeholder="Mô tả sản phẩm"
                  value={data.description}
                  onChange={handleChange}
                  id="description"
                  name="description"
                  rows={3}
                  required
                  className="bg-blue-50 p-2 outline-none border focus-within:border-primary-100 rounded resize-none"
                />
              </div>

              <div className="grid gap-1">
                <p className="font-semibold">Hình ảnh</p>
                <label
                  htmlFor="productImage"
                  className="bg-neutral-100 h-24 border rounded flex items-center justify-center cursor-pointer"
                >
                  <div className="text-center flex justify-center items-center flex-col">
                    {imageLoading ? (
                      <Loading />
                    ) : (
                      <>
                        <FaCloudUploadAlt size={35} />
                        <p>Tải hình ảnh</p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    id="productImage"
                    className="hidden"
                    accept="image/*"
                    onChange={handleUploadImage}
                  />
                </label>

                <div className="flex flex-wrap gap-4 mt-2">
                  {data.image.map((img, index) => (
                    <div
                      key={img + index}
                      className="h-20 w-20 bg-blue-50 border relative group"
                    >
                      <img
                        src={img}
                        alt="product"
                        className="w-full h-full object-scale-down cursor-pointer"
                        onClick={() => setViewImageURL(img)}
                      />
                      <div
                        onClick={() => handleDeleteImage(index)}
                        className="absolute bottom-0 right-0 p-1 bg-red-500 hover:bg-red-600 rounded text-white hidden group-hover:block"
                      >
                        <MdDelete />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid gap-1">
                <label className="font-semibold">Loại</label>
                <select
                  className="bg-blue-50 p-2 outline-none border rounded focus-within:border-primary-100"
                  value={data.type}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, type: e.target.value }))
                  }
                >
                  <option value="">Chọn loại</option>
                  <option value="Chay">Chay</option>
                  <option value="Mặn">Mặn</option>
                  <option value="Nước">Nước uống</option>
                  <option value="Kem">Kem</option>
                  <option value="Bánh">Bánh</option>
                  <option value="Trái cây">Trái cây</option>
                  <option value="Combo">Combo</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>

              <div className="grid gap-4">
                <div className="grid gap-1">
                  <label className="font-semibold">Sizes</label>
                  {data.sizes.map((s, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Tên size"
                        value={s.name}
                        onChange={(e) =>
                          setData((prev) => {
                            const newSizes = [...prev.sizes];
                            newSizes[idx].name = e.target.value;
                            return { ...prev, sizes: newSizes };
                          })
                        }
                        className="bg-blue-50 p-2 outline-none border rounded focus-within:border-primary-100 flex-1"
                      />
                      <input
                        type="number"
                        placeholder="Giá"
                        value={s.price || ""}
                        onChange={(e) =>
                          setData((prev) => {
                            const newSizes = [...prev.sizes];
                            newSizes[idx].price = Number(e.target.value) || 0;
                            return { ...prev, sizes: newSizes };
                          })
                        }
                        className="bg-blue-50 p-2 outline-none border rounded focus-within:border-primary-100 w-24"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setData((prev) => {
                            const newSizes = prev.sizes.filter(
                              (_, i) => i !== idx
                            );
                            return { ...prev, sizes: newSizes };
                          })
                        }
                        className="px-1 py-2 bg-blue-500  hover:bg-blue-600 rounded"
                      >
                        <IoClose size={22} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setData((prev) => ({
                        ...prev,
                        sizes: [...prev.sizes, { name: "", price: 0 }],
                      }))
                    }
                    className="hover:bg-primary-100 bg-white py-1 px-2 w-62 text-center font-semibold border border-primary-100 hover:text-neutral-900 cursor-pointer rounded mt-2"
                  >
                    Thêm Size (Không bắt buộc)
                  </button>
                </div>

                <div className="grid gap-1">
                  <label className="font-semibold">Đế</label>
                  {data.bases.map((b, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Tên đế"
                        value={b.name}
                        onChange={(e) =>
                          setData((prev) => {
                            const newBases = [...prev.bases];
                            newBases[idx].name = e.target.value;
                            return { ...prev, bases: newBases };
                          })
                        }
                        className="bg-blue-50 p-2 outline-none border rounded focus-within:border-primary-100 flex-1"
                      />
                      <input
                        type="number"
                        placeholder="Giá"
                        value={b.price || ""}
                        onChange={(e) =>
                          setData((prev) => {
                            const newBases = [...prev.bases];
                            newBases[idx].price = Number(e.target.value) || 0;
                            return { ...prev, bases: newBases };
                          })
                        }
                        className="bg-blue-50 p-2 outline-none border rounded focus-within:border-primary-100 w-24"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setData((prev) => {
                            const newBases = prev.bases.filter(
                              (_, i) => i !== idx
                            );
                            return { ...prev, bases: newBases };
                          })
                        }
                        className="px-1 py-2 bg-blue-500  hover:bg-blue-600 rounded"
                      >
                        <IoClose size={22} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setData((prev) => ({
                        ...prev,
                        bases: [...prev.bases, { name: "", price: 0 }],
                      }))
                    }
                    className="hover:bg-primary-100 bg-white py-1 px-2 w-62 text-center font-semibold border border-primary-100 hover:text-neutral-900 cursor-pointer rounded mt-2"
                  >
                    Thêm Đế (Không bắt buộc)
                  </button>
                </div>
              </div>
              <div className="grid gap-1">
                <label className="font-semibold">Danh mục chính</label>
                {loadingCategory ? (
                  <Loading />
                ) : (
                  <select
                    className="bg-blue-50 border w-full p-2 rounded hover:border-primary-100"
                    value=""
                    onChange={(e) => {
                      handleAddCategory(e.target.value);
                    }}
                  >
                    <option value="">Chọn danh mục</option>
                    {allCategory.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  {data.category.map((c, index) => (
                    <p
                      key={c._id + index}
                      className="bg-blue-50 px-2 py-1 rounded flex items-center gap-2"
                    >
                      {c.name}
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(c._id)}
                      >
                        <IoClose
                          className="hover:text-red-600 cursor-pointer"
                          size={20}
                        />
                      </button>
                    </p>
                  ))}
                </div>
              </div>

              <div className="grid gap-1">
                <label className="font-semibold">Danh mục phụ</label>
                <div>
                  {loadingSubCategory ? (
                    <Loading />
                  ) : (
                    <>
                      <select
                        className="bg-blue-50 border w-full p-2 rounded hover:border-primary-100"
                        value={selectSubCategory}
                        onChange={(e) => {
                          const value = e.target.value;
                          setSelectSubCategory(value);
                          handleAddSubCategory(value);
                        }}
                        disabled={data.category.length === 0}
                      >
                        <option value="">
                          {data.category.length === 0
                            ? "Vui lòng chọn danh mục chính trước"
                            : "Chọn danh mục phụ"}
                        </option>
                        {filteredSubCategories.map((c, index) => {
                          return (
                            <option key={c?._id || index} value={c?._id}>
                              {c?.name}
                            </option>
                          );
                        })}
                      </select>

                      <div className="flex flex-wrap gap-3 mt-2">
                        {data.subCategory.map((c, index) => {
                          return (
                            <div
                              key={c._id + index + "subCategorysection"}
                              className="text-sm flex items-center gap-2 bg-blue-50 px-2 py-1 rounded"
                            >
                              <p>{c.name}</p>
                              <button
                                type="button"
                                onClick={() => handleDeleteSubCategory(c._id)}
                                className="hover:text-red-600 cursor-pointer"
                              >
                                <IoClose size={20} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="grid gap-1">
                <label htmlFor="price" className="font-semibold">
                  Giá
                </label>
                <input
                  type="number"
                  placeholder="Nhập giá sản phẩm"
                  value={data.price}
                  onChange={handleChange}
                  id="price"
                  name="price"
                  required
                  className="bg-blue-50 p-2 outline-none border focus-within:border-primary-100"
                />
              </div>

              <div className="grid gap-1">
                <label htmlFor="discount" className="font-semibold">
                  Giảm giá
                </label>
                <input
                  type="number"
                  placeholder="Nhập giảm giá sản phẩm"
                  value={data.discount}
                  onChange={handleChange}
                  id="discount"
                  name="discount"
                  required
                  className="bg-blue-50 p-2 outline-none border focus-within:border-primary-100"
                />
              </div>
              {/**Add More Field */}

              <div className="grid gap-1">
                {Object.keys(data?.more_details || {}).map((k) => {
                  return (
                    <div className="grid gap-1" key={k}>
                      <label htmlFor={k} className="font-semibold">
                        {k}
                      </label>
                      <input
                        type="text"
                        value={data?.more_details?.[k] ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          setData((prev) => ({
                            ...prev,
                            more_details: {
                              ...prev.more_details,
                              [k]: value,
                            },
                          }));
                        }}
                        id={k}
                        required
                        className="bg-blue-50 p-2 outline-none border focus-within:border-primary-100"
                      />
                    </div>
                  );
                })}
              </div>

              <div
                onClick={() => setOpenAddField(true)}
                className="hover:bg-primary-100 bg-white py-1 px-3 w-32 text-center font-semibold border border-primary-100 hover:text-neutral-900 cursor-pointer rounded"
              >
                Thêm
              </div>
              <button className="bg-primary-100 hover:bg-primary-100 py-2 rounded font-semibold">
                Thêm sản phẩm
              </button>
            </form>
          </div>

          {ViewImageURL && (
            <ViewImage url={ViewImageURL} close={() => setViewImageURL("")} />
          )}

          {openAddField && (
            <AddFieldComponent
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              submit={handleAddField}
              close={() => setOpenAddField(false)}
            />
          )}
        </section>
      </div>
    </section>
  );
};

export default EditProductAdmin;
