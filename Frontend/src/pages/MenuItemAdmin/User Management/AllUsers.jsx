import React, { useEffect, useState } from "react";
import Axios from "../../../utils/AxiosAdmin";
import summaryApi from "../../../common/SummaryApi";
import EditUserRoleBox from "../../../components/EditUserRoleBox";
import DeleteUserBox from "../../../components/DeleteUserBox";
import { MdEdit, MdDelete, MdSearch, MdRefresh } from "react-icons/md";
import CreateDeliveryBox from "../../../components/CreateDeliveryBox";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [editUser, setEditUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await Axios({ ...summaryApi.all_users });

      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDelivery = async (formData) => {
    try {
      const res = await Axios({
        ...summaryApi.create_delivery,
        data: formData,
      });

      if (res.data.success) {
        setUsers((prev) => [res.data.data, ...prev]);
        setShowCreate(false);
        alert("Tạo tài khoản DELIVERY thành công, đã gửi email xác thực!");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Tạo tài khoản thất bại");
    }
  };

  const handleSaveRole = async (role) => {
    const res = await Axios({
      ...summaryApi.update_role(editUser._id),
      data: { role },
    });

    if (res.data.success) {
      setUsers((prev) =>
        prev.map((u) => (u._id === editUser._id ? res.data.data : u))
      );
      setEditUser(null);
    }
  };

  const handleDeleteUser = async () => {
    const res = await Axios(summaryApi.delete_user(deleteUser._id));

    if (res.data.success) {
      setUsers((prev) => prev.filter((u) => u._id !== deleteUser._id));
      setDeleteUser(null);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Quản lý người dùng
          </h1>
          <p className="text-gray-600">
            Quản lý và phân quyền cho người dùng hệ thống
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-blue-50 rounded-lg p-2 flex flex-col items-center w-20">
                <p className="text-lg font-bold text-blue-600">
                  {users.length}
                </p>
                <p className="text-xs text-blue-600 text-center">
                  Tổng người dùng
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-2 flex flex-col items-center w-20">
                <p className="text-lg font-bold text-green-600">
                  {users.filter((u) => u.role === "ADMIN").length}
                </p>
                <p className="text-xs text-green-600 text-center">
                  Quản trị viên
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 flex-1 sm:justify-end">
              <div className="relative flex-1 sm:max-w-md">
                <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên hoặc email..."
                  className="w-full px-4 pl-10 py-2 border rounded-lg border-gray-300 
           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
           transition-all"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <button
                onClick={fetchUsers}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <MdRefresh
                  className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
                />
                <span className="hidden sm:block">Làm mới</span>
              </button>
            </div>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              + Tạo tài khoản nhân viên
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-4 px-4 text-left text-sm font-semibold text-gray-900">
                        Người dùng
                      </th>
                      <th className="py-4 px-4 text-left text-sm font-semibold text-gray-900 hidden sm:table-cell">
                        Email
                      </th>
                      <th className="py-4 px-4 text-left text-sm font-semibold text-gray-900">
                        Vai trò
                      </th>
                      <th className="py-4 px-4 text-right text-sm font-semibold text-gray-900">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filtered.map((user, index) => (
                      <tr
                        key={user._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {user.profile_image ? (
                                <img
                                  src={user.profile_image}
                                  className="w-full h-full object-cover"
                                  alt=""
                                />
                              ) : (
                                user.name.charAt(0).toUpperCase()
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {user.name}
                              </p>
                              <p className="text-sm text-gray-500 sm:hidden">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-900 hidden sm:table-cell">
                          {user.email}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              user.role === "ADMIN"
                                ? "bg-green-100 text-green-800"
                                : user.role === "DELIVERY"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setEditUser(user)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Chỉnh sửa"
                            >
                              <MdEdit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => setDeleteUser(user)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Xóa"
                            >
                              <MdDelete className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filtered.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-2">
                    <MdSearch className="w-12 h-12 mx-auto" />
                  </div>
                  <p className="text-gray-500 text-lg">
                    Không tìm thấy người dùng
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    {search
                      ? "Thử tìm kiếm với từ khóa khác"
                      : "Chưa có người dùng nào trong hệ thống"}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {editUser && (
          <EditUserRoleBox
            user={editUser}
            close={() => setEditUser(null)}
            onSave={handleSaveRole}
          />
        )}

        {deleteUser && (
          <DeleteUserBox
            user={deleteUser}
            close={() => setDeleteUser(null)}
            confirm={handleDeleteUser}
          />
        )}

        {showCreate && (
          <CreateDeliveryBox
            close={() => setShowCreate(false)}
            onCreate={handleCreateDelivery}
          />
        )}
      </div>
    </div>
  );
};

export default AllUsers;
