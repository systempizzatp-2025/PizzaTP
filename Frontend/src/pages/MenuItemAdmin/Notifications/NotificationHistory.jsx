import React, { useState, useEffect } from "react";
import Axios from "../../../utils/AxiosAdmin";
import { connectSocket, getSocket } from "../../../utils/socket";

import summaryApi from "../../../common/SummaryApi";
import { FaTrash, FaImage } from "react-icons/fa";
import { toast } from "react-hot-toast";

const NotificationHistory = () => {
  const [notifications, setNotifications] = useState([]);

  const loadNotifications = async () => {
    try {
      const res = await Axios.get(summaryApi.notifications.admin_all.url);
      setNotifications(res.data);
    } catch (error) {
      console.error("Load notifications failed", error);
    }
  };

  useEffect(() => {
    loadNotifications();

    const token = localStorage.getItem("adminAccessToken");
    const socket = connectSocket(token);

    socket.on("notification:new", (noti) => {
      setNotifications((prev) => [noti, ...prev]);
    });

    return () => {
      socket.off("notification:new");
    };
  }, []);

  const handleDelete = async (id) => {
    try {
      await Axios.delete(`${summaryApi.notifications.admin_delete.url}/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      toast.success("Xóa thông báo thành công");
    } catch (error) {
      console.error("Delete notification failed", error);
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "Promo":
        return "bg-yellow-100 text-yellow-700";
      case "Order":
        return "bg-green-100 text-green-700";
      case "System":
        return "bg-red-100 text-red-700";
      default:
        return "bg-primary-100 text-white";
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h2 className="text-2xl font-bold  mb-6">Lịch sử thông báo</h2>

      <div className="bg-white shadow-md border border-gray-200 rounded-xl">
        <div className="p-4 sm:p-6">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Chưa có thông báo nào</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((item) => (
                <div
                  key={item._id}
                  className="border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-primary-100 transition-all duration-200 bg-white"
                >
                  <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-800 text-lg">
                          {item.title}
                        </h3>
                        {/* <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(
                            item.type
                          )}`}
                        >
                          {item.type}
                        </span> */}
                      </div>

                      <p className="text-gray-600">{item.message}</p>

                      {item.image && (
                        <div className="mt-4">
                          <div className="relative inline-block">
                            <img
                              src={item.image}
                              alt="Thông báo"
                              className="w-28 h-28 sm:w-36 sm:h-36 object-cover rounded-lg border border-gray-300 shadow-sm"
                            />

                            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 rounded-lg transition flex items-center justify-center">
                              <FaImage className="text-white text-xl opacity-0 hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex lg:flex-col gap-3 items-start">
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 transition"
                      >
                        <FaTrash />
                        <span className="text-sm font-medium">Xóa</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationHistory;
