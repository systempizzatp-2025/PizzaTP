import React, { useState, useEffect, useRef } from "react";
import { Bell, X } from "lucide-react";
import Axios from "../utils/AxiosUser";
import summaryApi from "../common/SummaryApi";
import { connectSocket } from "../utils/socket";

import { useSelector } from "react-redux";

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const dropdownRef = useRef(null);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (!user?._id) return;

    const token = localStorage.getItem("accessToken");
    const socket = connectSocket(token);

    socket.emit("notification:join", user._id);

    socket.on("notification:new", (noti) => {
      setNotifications((prev) => [noti, ...prev]);
      setUnread((prev) => prev + 1);
    });

    socket.on("notification:batch", (notis) => {
      setNotifications((prev) => [...notis, ...prev]);
      setUnread((prev) => prev + notis.length);
    });

    return () => {
      socket.off("notification:new");
      socket.off("notification:batch");
    };
  }, [user?._id]);

  const loadNotifications = async () => {
    try {
      const res = await Axios.get(summaryApi.notifications.get_user.url);
      setNotifications(res.data);
      setUnread(res.data.filter((n) => !n.isRead).length);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (open) loadNotifications();
  }, [open]);

  const markRead = async (id) => {
    try {
      await Axios.put(`${summaryApi.notifications.mark_read.url}/${id}`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnread((prev) => prev - 1);
    } catch (error) {
      console.error("Fail", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await Axios.put(summaryApi.notifications.mark_all_read.url);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnread(0);
    } catch (error) {
      console.error("Fail", error);
    }
  };

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2 hover:text-red-500 transition-colors"
        aria-label="Thông báo"
      >
        <Bell size={22} />
        {unread > 0 && (
          <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setOpen(false)}
          />

          <div className="hidden md:block absolute top-12 right-0 w-80 bg-white dark:bg-gray-800 shadow-xl rounded-lg z-50 border border-gray-200">
            <div className="flex items-center justify-between p-4 border-b">
              <p className="font-semibold text-lg">Thông báo</p>
              {unread > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-700 px-2 py-1 rounded hover:bg-blue-50"
                >
                  Đánh dấu tất cả đã đọc
                </button>
              )}
            </div>

            <div className="max-h-90 overflow-y-auto p-2 scrollBarCustom">
              {notifications.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Không có thông báo
                </p>
              ) : (
                <ul className="space-y-2">
                  {notifications.map((item) => (
                    <li
                      key={item._id}
                      onClick={() => markRead(item._id)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors
                        ${
                          !item.isRead
                            ? "bg-blue-50 border border-blue-100 hover:bg-blue-100"
                            : "hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                    >
                      <div className="flex items-start gap-3">
                        {!item.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p
                            className={`font-medium truncate ${
                              !item.isRead ? "text-blue-800" : "text-gray-800"
                            }`}
                          >
                            {item.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {item.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(item.createdAt).toLocaleString("vi-VN")}
                          </p>
                          {item.image && (
                            <img
                              src={item.image}
                              alt="notification"
                              className="w-full h-full object-cover rounded-lg mt-2"
                            />
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="md:hidden fixed inset-0 z-50 flex flex-col">
            <div className="bg-white dark:bg-gray-800 border-b p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-lg">Thông báo</p>
                <div className="flex items-center gap-4">
                  {unread > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Đánh dấu tất cả đã đọc
                    </button>
                  )}
                  <button
                    onClick={() => setOpen(false)}
                    className="p-1 hover:bg-gray-100 rounded"
                    aria-label="Đóng"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex-1 bg-white dark:bg-gray-800 overflow-y-auto scrollBarCustom p-4">
              {notifications.length === 0 ? (
                <p className="text-gray-500 text-center py-12">
                  Không có thông báo
                </p>
              ) : (
                <ul className="space-y-3">
                  {notifications.map((item) => (
                    <li
                      key={item._id}
                      onClick={() => markRead(item._id)}
                      className={`p-4 rounded-lg cursor-pointer transition-colors
                        ${
                          !item.isRead
                            ? "bg-blue-50 border border-blue-100"
                            : "bg-gray-50"
                        }`}
                    >
                      <div className="flex items-start gap-3">
                        {!item.isRead && (
                          <div className="w-3 h-3 bg-blue-500 rounded-full mt-1 flex-shrink-0"></div>
                        )}
                        <div className="flex-1">
                          <p
                            className={`font-medium ${
                              !item.isRead ? "text-blue-800" : "text-gray-800"
                            }`}
                          >
                            {item.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {item.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(item.createdAt).toLocaleString("vi-VN")}
                          </p>
                          {item.image && (
                            <img
                              src={item.image}
                              alt="notification"
                              className="w-full h-full object-cover rounded-lg mt-3"
                            />
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 border-t p-4">
              <button
                onClick={() => setOpen(false)}
                className="w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
              >
                Đóng
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;
