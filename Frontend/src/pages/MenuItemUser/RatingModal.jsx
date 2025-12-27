import React, { useState, useRef } from "react";
import { X, Star, Smile, Send, Image as ImageIcon } from "react-feather";
import toast from "react-hot-toast";
import Axios from "../../utils/AxiosUser";
import SummaryApi from "../../common/SummaryApi";
import AxiosToastError from "../../utils/AxiosToastError";

const emojiIcons = ["😊", "😂", "😍", "😢", "😡", "👍", "👎", "🎉"];

const RatingModal = ({ product, onClose, setComments, onSuccess }) => {
  const fileInputRef = useRef(null);

  const [newComment, setNewComment] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const addEmoji = (emoji) => {
    setNewComment((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map((file) => ({
      file,
      type: file.type.startsWith("image/") ? "image" : "",
      url: URL.createObjectURL(file),
    }));
    setAttachments((prev) => [...prev, ...newAttachments]);
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const submitComment = async () => {
    if (!newComment.trim() && attachments.length === 0) {
      toast.error("Vui lòng nhập nội dung hoặc thêm hình ảnh");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("product", product.productId);
      formData.append("comment", newComment);
      formData.append("rating", rating);

      attachments.forEach((attachment) => {
        formData.append("photos", attachment.file);
      });

      const res = await Axios({
        ...SummaryApi.addComment,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        setComments((prev) => [...prev, res.data.data]);
        setNewComment("");
        setAttachments([]);
        setRating(0);
        setShowEmojiPicker(false);
        toast.success("Đã thêm bình luận");
        onSuccess?.();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Đánh giá sản phẩm</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        <div className="flex p-4 border-b border-gray-100 gap-4">
          <div className="w-20 h-20 flex-shrink-0">
            <img
              src={
                product.product_details?.image?.[0] ||
                "https://via.placeholder.com/100"
              }
              alt={product.product_details?.name}
              className="w-full h-full object-cover rounded-lg border border-gray-200"
            />
          </div>
          <div className="flex items-center justify-center">
            <h3 className="font-medium text-gray-800 line-clamp-2">
              {product.product_details?.name}
            </h3>
          </div>
        </div>

        <div className="p-4">
          <div className="mb-3">
            <span className="text-sm text-gray-600 font-medium">Đánh giá:</span>
            <div className="flex gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  <Star
                    className={`w-5 h-5 ${
                      star <= (hoverRating || rating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="relative mb-3">
            <textarea
              placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
              className="w-full border border-gray-300 rounded-lg p-3 pr-10 resize-none focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-100 text-sm min-h-[80px]"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="absolute right-3 bottom-3 text-gray-400 hover:text-gray-600"
            >
              <Smile className="w-4 h-4" />
            </button>
            {showEmojiPicker && (
              <div className="absolute right-0 bottom-12 bg-white border border-gray-200 rounded-lg shadow-lg p-3 w-64 z-10">
                <div className="grid grid-cols-8 gap-1">
                  {emojiIcons.map((emoji, idx) => (
                    <button key={idx} onClick={() => addEmoji(emoji)}>
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 flex-wrap mb-3">
            {attachments.map((att, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={att.url}
                  alt="preview"
                  className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                />
                <button
                  onClick={() => removeAttachment(idx)}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1 px-3 py-1.5 text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs"
            >
              <ImageIcon className="w-4 h-4" />
              Ảnh
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            <button
              onClick={submitComment}
              disabled={!newComment.trim() && attachments.length === 0}
              className="flex items-center gap-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-1.5 rounded-lg text-xs"
            >
              <Send className="w-3 h-3" />
              Gửi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
