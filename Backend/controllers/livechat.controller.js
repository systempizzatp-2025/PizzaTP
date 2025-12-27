import LiveChat from "../models/livechat.model.js";

export const getMyChat = async (req, res) => {
  const userId = req.userId;

  let chat = await LiveChat.findOne({ userId }).lean();
  if (!chat) {
    chat = await LiveChat.create({ userId, unreadCount: 0 });
  }

  res.json({ success: true, data: chat });
};

export const getAllChatsForAdmin = async (req, res) => {
  const chats = await LiveChat.find()
    .populate("userId", "name email")
    .sort({ updatedAt: -1 })
    .lean();

  res.json({ success: true, data: chats });
};

export const getChatByUserId = async (req, res) => {
  const chat = await LiveChat.findOne({ userId: req.params.userId }).lean();
  if (chat) {
    await LiveChat.findOneAndUpdate(
      { userId: req.params.userId },
      { unreadCount: 0 }
    );
  }

  res.json({
    success: true,
    data: chat || { messages: [] },
  });
};   

export const deleteMyChat = async (req, res) => {
  const userId = req.userId;

  await LiveChat.findOneAndDelete({ userId });

  res.json({
    success: true,
    message: "Đã xóa đoạn chat",
  });
};
