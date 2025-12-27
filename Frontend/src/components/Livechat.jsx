import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { connectSocket, getSocket, disconnectSocket } from "../utils/socket";
import { SiLivechat } from "react-icons/si";
import logo from "../assets/logo_tp.png";
import { MdOutlineCancel } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
import toast from "react-hot-toast";

export default function Livechat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef();
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!token) {
      setMessages([]);
      disconnectSocket();
      return;
    }

    const socket = connectSocket(token);

    axios
      .get(`http://localhost:8080/api/livechat/my`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMessages(res.data.data.messages || []))
      .catch((err) => console.error("Lấy lịch sử chat thất bại", err));

    const handleNewMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("message:new", handleNewMessage);
    socket.on("admin:typing", () => setIsTyping(true));
    socket.on("admin:stop-typing", () => setIsTyping(false));

    return () => {
      socket.off("message:new", handleNewMessage);
      socket.off("admin:typing");
      socket.off("admin:stop-typing");
    };
  }, [token]);

  useEffect(() => {
    if (open && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const send = () => {
    if (!text.trim()) return;
    const socket = getSocket();
    if (socket) {
      socket.emit("user:send-message", text);
      setText("");
    }
  };

  const handleTyping = (e) => {
    setText(e.target.value);
    const socket = getSocket();
    if (socket) {
      if (e.target.value.trim()) {
        socket.emit("user:typing");
      } else {
        socket.emit("user:stop-typing");
      }
    }
  };

  const deleteChat = async () => {
    toast.promise(
      axios.delete("http://localhost:8080/api/livechat/my", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      {
        loading: "Đang xóa đoạn chat...",
        success: () => {
          setMessages([]);
          setOpen(false);
          return "Đã xóa đoạn chat";
        },
        error: "Xóa đoạn chat thất bại",
      }
    );
  };

  if (!open)
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-xl hover:shadow-2xl flex items-center justify-center z-[100] hover:scale-110 active:scale-95 transition-all duration-200 animate-bounce"
        aria-label="Mở chat hỗ trợ"
      >
        <SiLivechat className="text-2xl md:text-3xl" />
      </button>
    );

  return (
    <div className="fixed inset-0 md:inset-auto md:bottom-6 md:right-6 md:w-[90vw] md:max-w-[400px] md:h-[85vh] md:max-h-[600px] bg-white md:rounded-2xl shadow-2xl flex flex-col overflow-hidden z-[100] md:border md:border-gray-200 animate-slideUp">
      <div
        className="md:hidden fixed inset-0 bg-black/20"
        onClick={() => setOpen(false)}
      />

      <div className="relative flex-1 flex flex-col bg-white md:rounded-2xl max-h-screen md:max-h-full">
        <div className="bg-blue-500 p-4 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <img src={logo} alt="Logo" />
              </div>
            </div>
            <div>
              <h2 className="font-medium text-base md:text-lg">
                Nhân viên hỗ trợ
              </h2>
            </div>
          </div>
          <div className="flex">
            <button
              onClick={deleteChat}
              className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-all active:scale-90"
              aria-label="Xóa đoạn chat"
            >
              <AiOutlineDelete title="Xóa đoạn chat" className="text-xl" />
            </button>
            <button
              onClick={() => setOpen(false)}
              className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-all active:scale-90"
              aria-label="Đóng chat"
            >
              <MdOutlineCancel title="Thoát đoạn chat" className="text-xl" />
            </button>
          </div>
        </div>

        <div className="flex-1 bg-gradient-to-b from-gray-50 to-white p-3 md:p-4 overflow-y-auto scrollBarCustom">
          <div className="space-y-3 max-w-3xl mx-auto">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <h3 className="font-medium text-gray-700 mb-1">Chào bạn!</h3>
                <p className="text-sm text-gray-500">
                  Hãy bắt đầu trò chuyện với chúng tôi
                </p>
              </div>
            ) : (
              messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${
                    m.sender === "USER" ? "justify-end" : "justify-start"
                  } animate-fadeIn`}
                >
                  <div className="max-w-[85%]">
                    <div
                      className={`px-4 py-3 rounded-2xl text-sm md:text-base ${
                        m.sender === "USER"
                          ? "bg-white text-gray-700 rounded-br-none shadow-sm border border-gray-200"
                          : "bg-white text-gray-700 rounded-bl-none shadow-sm border border-gray-200"
                      }`}
                    >
                      {m.content}
                    </div>
                    <p
                      className={`text-xs mt-1 px-1 text-gray-400 ${
                        m.sender === "USER" ? "text-right" : ""
                      }`}
                    >
                      {new Date(m.createdAt || Date.now()).toLocaleTimeString(
                        [],
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                </div>
              ))
            )}

            {isTyping && (
              <div className="flex justify-start animate-fadeIn">
                <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-100">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        <div className="border-t border-gray-200 bg-white p-2">
          <div className="flex gap-2 items-center">
            <textarea
              value={text}
              onChange={handleTyping}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Nhập tin nhắn..."
              rows={1}
              className="flex-1 bg-gray-100 rounded-xl px-4 py-2 outline-none text-sm md:text-base
             focus:ring-2 ring-blue-500 transition-all resize-none
             min-h-[44px] max-h-[160px] overflow-y-auto scrollBarCustom"
            />

            <button
              onClick={send}
              disabled={!text.trim()}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                text.trim()
                  ? "text-blue-500 active:scale-95"
                  : "text-gray-500 cursor-not-allowed"
              }`}
              aria-label="Gửi tin nhắn"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transform rotate-45"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
