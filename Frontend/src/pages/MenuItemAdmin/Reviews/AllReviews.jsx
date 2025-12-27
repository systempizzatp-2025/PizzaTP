import React, { useEffect, useState } from "react";

import Axios from "../../../utils/AxiosAdmin";
import summaryApi from "../../../common/SummaryApi";
import ConfirmBox from "../../../components/ConfirmBox";
import Loading from "../../../components/Loading";
import { MdDelete } from "react-icons/md";

const AllReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterRating, setFilterRating] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const getReviews = async () => {
    try {
      setLoading(true);
      const res = await Axios({ ...summaryApi.all_reviews });
      if (res.data.success) {
        setReviews(res.data.data);
      }
    } catch (err) {
      console.error("Lỗi khi tải review:", err);
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteReview = async () => {
    try {
      const res = await Axios({ ...summaryApi.delete_review(deleteId) });
      if (res.data.success) {
        setReviews((prev) => prev.filter((rv) => rv._id !== deleteId));
      }
      setDeleteId(null);
    } catch (error) {}
  };

  useEffect(() => {
    getReviews();
  }, []);

  const filteredReviews = reviews.filter((rv) => {
    const matchText =
      rv.comment.toLowerCase().includes(search.toLowerCase()) ||
      rv.user?.name?.toLowerCase().includes(search.toLowerCase());

    const matchRating = filterRating
      ? rv.rating === Number(filterRating)
      : true;

    return matchText && matchRating;
  });

  if (loading) return <Loading />;

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-bold mb-4 ">Tất cả đánh giá</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Tìm theo tên hoặc nội dung..."
          className="border border-primary-100 px-4 py-2 rounded w-full md:w-80 focus:ring-2 focus:ring-primary-100 focus:outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border border-primary-100 px-4 py-2 rounded w-full md:w-48 focus:ring-2 focus:ring-primary-100 focus:outline-none"
          value={filterRating}
          onChange={(e) => setFilterRating(e.target.value)}
        >
          <option value="">Lọc theo sao</option>
          <option value="5">5 sao</option>
          <option value="4">4 sao</option>
          <option value="3">3 sao</option>
          <option value="2">2 sao</option>
          <option value="1">1 sao</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-300 shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 ">
            <tr>
              <th className="p-3 border">#</th>
              <th className="p-3 border">Người dùng</th>
              <th className="p-3 border">Sản phẩm</th>
              <th className="p-3 border">Số sao</th>
              <th className="p-3 border">Nội dung</th>
              <th className="p-3 border">Ngày</th>
              <th className="p-3 border">Xoá</th>
            </tr>
          </thead>

          <tbody>
            {filteredReviews.map((rv, index) => (
              <tr
                key={rv._id}
                className="text-center odd:bg-gray-50 even:bg-white"
              >
                <td className="p-3 border">{index + 1}</td>

                <td className="p-3 border font-medium">
                  {rv.user?.name || "N/A"}
                </td>

                <td className="p-3 border">
                  {rv.product ? (
                    <div className="flex items-center gap-3 justify-center">
                      <img
                        src={rv.product.image?.[0] || ""}
                        alt={rv.product.name}
                        className="w-12 h-12 object-cover rounded shadow"
                      />
                      <span className="hidden md:block">{rv.product.name}</span>
                    </div>
                  ) : (
                    "N/A"
                  )}
                </td>

                <td className="p-3 border text-yellow-500 font-semibold">
                  {rv.rating} ★
                </td>

                <td className="p-3 border max-w-xs break-words">
                  {rv.comment}
                </td>

                <td className="p-3 border">
                  {new Date(rv.createdAt).toLocaleDateString("vi-VN")}
                </td>

                <td className="p-3 border">
                  <button
                    onClick={() => setDeleteId(rv._id)}
                    className="px-3 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition"
                  >
                    <MdDelete className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredReviews.length === 0 && (
          <p className="text-center py-4">Không tìm thấy đánh giá nào.</p>
        )}
      </div>

      {deleteId && (
        <ConfirmBox
          close={() => setDeleteId(null)}
          cancel={() => setDeleteId(null)}
          confirm={confirmDeleteReview}
        />
      )}
    </div>
  );
};

export default AllReviews;
