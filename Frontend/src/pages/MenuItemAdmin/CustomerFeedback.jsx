import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { connectSocket, getSocket } from "../../utils/socket";
import { MessageSquare, Send, Users, ChevronLeft, Search } from "lucide-react";

export default function CustomerFeedback() {
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const selectedUserRef = useRef(null);
  const bottomRef = useRef();
  const token = localStorage.getItem("adminAccessToken");

  useEffect(() => {
    if (!token) return;
    const socket = connectSocket(token);

    axios
      .get(`http://localhost:8080/api/livechat`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setChats(res.data.data);
      });

    socket.on("message:new", (msg) => {
      if (
        selectedUserRef.current &&
        selectedUserRef.current._id === msg.userId
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    socket.on("chat:update", (data) => {
      setChats((prev) =>
        prev.map((c) => {
          if (c.userId._id === data.userId) {
            const isCurrentChat = selectedUserRef.current?._id === data.userId;
            return {
              ...c,
              lastMessage: data.lastMessage,
              unreadCount: isCurrentChat ? 0 : data.unreadCount,
            };
          }
          return c;
        })
      );
    });

    return () => {
      socket.off("message:new");
      socket.off("chat:update");
    };
  }, [token]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages]);

  const openChat = async (user) => {
    setSelectedUser(user);
    selectedUserRef.current = user;
    setMessages([]);

    if (window.innerWidth < 768) {
      setSidebarVisible(false);
    }

    setChats((prev) =>
      prev.map((c) =>
        c.userId._id === user._id ? { ...c, unreadCount: 0 } : c
      )
    );

    getSocket()?.emit("admin:join-user", user._id);

    try {
      const res = await axios.get(
        `http://localhost:8080/api/livechat/${user._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessages(res.data.data.messages || []);
    } catch (err) {
      console.error("Lỗi load tin nhắn:", err);
    }
  };

  const send = () => {
    if (!text.trim() || !selectedUser) return;
    getSocket()?.emit("admin:send-message", {
      toUserId: selectedUser._id,
      content: text,
    });
    setText("");
  };

  const filteredChats = chats.filter((chat) =>
    chat.userId.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-6rem)] bg-gray-100  overflow-hidden flex flex-col font-sans">
      <div className="flex flex-1 gap-4 min-h-0">
        <div
          className={`${
            sidebarVisible ? "flex" : "hidden"
          } md:flex flex-col w-full md:w-80 h-full min-h-0 bg-white rounded-xl shadow-sm overflow-hidden `}
        >
          <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-white flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <h2 className="font-bold text-lg text-gray-800">Khách hàng</h2>
              </div>
              <button
                className="md:hidden text-gray-500 hover:text-gray-700"
                onClick={() => setSidebarVisible(false)}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm khách hàng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto scrollBarCustom">
            {filteredChats.map((c) => (
              <div
                key={c.userId._id}
                onClick={() => openChat(c.userId)}
                className={`p-4 cursor-pointer border-b border-gray-100 hover:bg-blue-50 transition-all ${
                  selectedUser?._id === c.userId._id
                    ? "bg-blue-50 border-l-4 border-blue-600"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-blue-600">
                        {c.userId.name.charAt(0)}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-gray-800 truncate">
                        {c.userId.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {c.lastMessage || "Chưa có tin nhắn..."}
                      </p>
                    </div>
                  </div>
                  {c.unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                      {c.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`${
            !sidebarVisible ? "flex" : "hidden"
          } md:flex flex-1 flex-col h-full min-h-0 bg-white rounded-xl shadow-sm overflow-hidden`}
        >
          {selectedUser ? (
            <>
              <div className="p-4 border-b flex-shrink-0 flex items-center gap-3">
                <button
                  className="md:hidden text-gray-500"
                  onClick={() => setSidebarVisible(true)}
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="font-bold text-blue-600">
                    {selectedUser.name.charAt(0)}
                  </span>
                </div>
                <h3 className="font-bold text-gray-800">{selectedUser.name}</h3>
              </div>

              <div className="flex-1 overflow-y-auto scrollBarCustom p-4 md:p-6 bg-gradient-to-b from-blue-50/30 to-white">
                <div className="space-y-4 max-w-4xl mx-auto">
                  {messages.map((m, i) => (
                    <div
                      key={i}
                      className={`flex ${
                        m.sender === "ADMIN" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] md:max-w-[70%] px-4 py-3 rounded-2xl shadow-sm ${
                          m.sender === "ADMIN"
                            ? "bg-blue-600 text-white rounded-br-none"
                            : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
                        }`}
                      >
                        <div className="text-sm">{m.content}</div>
                        <div
                          className={`text-[10px] mt-1 ${
                            m.sender === "ADMIN"
                              ? "text-blue-200"
                              : "text-gray-400"
                          }`}
                        >
                          {new Date(
                            m.createdAt || Date.now()
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={bottomRef} />
                </div>
              </div>

              <div className="p-4 border-t flex-shrink-0">
                <div className="flex gap-2 max-w-4xl mx-auto">
                  <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && send()}
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 border border-gray-300 rounded-xl px-4 py-1 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={send}
                    disabled={!text.trim()}
                    className={`p-3 rounded-xl font-bold transition-all ${
                      text.trim()
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="w-10 h-10 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-700">
                Chào mừng đến với hệ thống CSKH
              </h3>
              <p className="text-gray-500 max-w-sm mt-2">
                Chọn một khách hàng bên trái để bắt đầu hỗ trợ.
              </p>
              <button
                onClick={() => setSidebarVisible(true)}
                className="md:hidden mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg"
              >
                Danh sách khách hàng
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
