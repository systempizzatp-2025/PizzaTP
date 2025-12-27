import React, { useState } from "react";
import { IoClose } from "react-icons/io5";

const EditUserRoleBox = ({ close, user, onSave }) => {
  const [role, setRole] = useState(user.role);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md transform transition-all">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Chỉnh sửa vai trò
          </h2>
          <button
            onClick={close}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <IoClose className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-white font-semibold text-lg">
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
              <p className="font-semibold text-gray-900 text-lg">{user.name}</p>
              <p className="text-gray-500 text-sm">{user.email}</p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Vai trò
            </label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="USER">Người dùng</option>
              <option value="ADMIN">Quản trị viên</option>
              <option value="DELIVERY">Nhân viên giao hàng</option>
            </select>

            <div className="text-xs text-gray-500 space-y-1 mt-2">
              <p>
                <strong>User:</strong> Người dùng thông thường
              </p>
              <p>
                <strong>Admin:</strong> Toàn quyền quản trị hệ thống
              </p>
              <p>
                <strong>Delivery:</strong> Nhân viên giao hàng
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <button
            onClick={close}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={() => onSave(role)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserRoleBox;
