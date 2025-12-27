import jwt from "jsonwebtoken";
import LiveChat from "../models/livechat.model.js";

const liveChatSocket = (io) => {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("NO_TOKEN"));
      const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);

      socket.userId = decoded.id || decoded._id;
      socket.role = decoded.role;
      next();
    } catch (err) {
      next(new Error("UNAUTHORIZED"));
    }
  });

  io.on("connection", (socket) => {
    const { userId, role } = socket;


    socket.join(`USER_${userId}`);

    if (role === "ADMIN") {
      socket.join("ADMIN_GLOBAL");
    }

    socket.on("admin:join-user", async (targetUserId) => {
      socket.rooms.forEach((r) => {
        if (r.startsWith("USER_") && r !== `USER_${userId}`) {
          socket.leave(r);
        }
      });
      socket.join(`USER_${targetUserId}`);

      try {
        await LiveChat.findOneAndUpdate(
          { userId: targetUserId },
          { unreadCount: 0 }
        );
      } catch (err) {
        console.error("Lỗi reset unreadCount:", err);
      }
    });

    const sendMessage = async (roomOwnerId, senderRole, content) => {
      if (!content.trim()) return;
      try {
        let chat = await LiveChat.findOne({ userId: roomOwnerId });
        if (!chat && senderRole === "USER") {
          chat = await LiveChat.create({ userId: roomOwnerId, unreadCount: 0 });
        }
        if (!chat) return;

        const message = {
          sender: senderRole,
          content,
          createdAt: new Date(),
          userId: roomOwnerId,
        };

        chat.messages.push(message);
        chat.lastMessage = content;

        if (senderRole === "USER") {
          chat.unreadCount = (chat.unreadCount || 0) + 1;
        } else {
          chat.unreadCount = 0;
        }

        await chat.save();

        io.to(`USER_${roomOwnerId}`).emit("message:new", message);

        if (senderRole === "USER") {
          io.to("ADMIN_GLOBAL").emit("chat:update", {
            userId: roomOwnerId,
            lastMessage: content,
            unreadCount: chat.unreadCount,
          });
        }
      } catch (err) {
        console.error("Lỗi Socket:", err);
      }
    };

    socket.on("user:send-message", (content) =>
      sendMessage(userId, "USER", content)
    );

    socket.on("admin:send-message", ({ toUserId, content }) =>
      sendMessage(toUserId, "ADMIN", content)
    );
  });
};

export default liveChatSocket;
