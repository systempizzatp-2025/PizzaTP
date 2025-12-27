import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Axios from "../utils/AxiosUser";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import CardProduct from "../components/CardProduct";
import { useSelector } from "react-redux";
import valideURLConvert from "../utils/valideURLConvert";
import { ChevronLeft } from "lucide-react";

const ProductListPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const navigate = useNavigate();

  const subCategoryArr = params?.subCategory?.split("-");
  const rawName = subCategoryArr?.slice(0, -1)?.join(" ");
  const subCategoryName = rawName
    ?.split(" ")
    ?.map((w) => w.charAt(0).toUpperCase() + w.slice(1)) 
    ?.join(" ");
  const categoryId = params.category.split("-").pop();
  const subCategoryId = params.subCategory.split("-").pop();

  const AllSubCategory = useSelector((state) => state.product.allSubCategory);
  const [DisplaySubCategory, setDisplaySubcategory] = useState([]);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProductByCategoryAndSubCategory,
        data: { categoryId, subCategoryId, page: 1, limit: 8 },
      });
      if (response.data.success) setData(response.data.data);
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [params]);
  useEffect(() => {
    const sub = AllSubCategory.filter((s) =>
      s.category.some((el) => el._id === categoryId)
    );
    setDisplaySubcategory(sub);
  }, [params, AllSubCategory]);

  return (
    <section className="mt-24 px-3 md:px-4 lg:px-6">
      <div className="container mx-auto mb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 mb-4 bg-white border border-gray-200 hover:border-gray-300 rounded-lg shadow-sm hover:shadow text-gray-700 hover:text-gray-900 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-medium">Quay lại</span>
        </button>
      </div>

      <div className="container mx-auto grid grid-cols-[90px,1fr] md:grid-cols-[200px,1fr] lg:grid-cols-[260px,1fr] gap-4">
        <aside className="bg-white shadow-md rounded-lg p-2 max-h-[90vh] overflow-y-auto scrollBarCustom sticky top-28">
          <div className="grid gap-3">
            {DisplaySubCategory.map((s, index) => {
              const url = `/${valideURLConvert(s.category[0]?.name)}-${
                s.category[0]?._id
              }/${valideURLConvert(s.name)}-${s._id}`;
              return (
                <Link
                  key={index}
                  to={url}
                  className={`rounded-lg p-2 shadow-sm transition ${
                    subCategoryId === s._id
                      ? "bg-blue-100 shadow-md"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div className="w-fit mx-auto">
                    <img
                      src={s.image}
                      alt="subCategory"
                      className="w-14 h-14 object-contain mx-auto"
                    />
                  </div>
                  <p className="text-xs text-center mt-1 font-medium text-gray-700">
                    {s.name}
                  </p>
                </Link>
              );
            })}
          </div>
        </aside>

        <div className="max-h-[90vh] overflow-y-auto scrollBarCustom pr-1">
          <div className="bg-white shadow-md p-4 mb-4 sticky top-0 z-10">
            <h3 className="font-semibold text-lg text-gray-800">
              {subCategoryName}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{data.length} sản phẩm</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-10">
            {data.length > 0 ? (
              data.map((p, index) => (
                <CardProduct
                  key={p._id + "productSubCategory" + index}
                  data={p}
                  className="transition-transform duration-300 hover:scale-[1.03]"
                />
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                {loading ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500">Đang tải sản phẩm...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        ></path>
                      </svg>
                    </div>
                    <p className="text-gray-500 text-lg font-medium">
                      Không có sản phẩm
                    </p>
                    <p className="text-gray-400 text-sm">
                      Hiện tại chưa có sản phẩm trong danh mục này
                    </p>
                    <button
                      onClick={() => navigate(-1)}
                      className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                    >
                      Quay lại danh mục
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {loading && data.length > 0 && (
            <div className="text-center py-4">
              <div className="inline-block w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-2 text-gray-500 text-sm">Đang tải thêm...</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductListPage;
