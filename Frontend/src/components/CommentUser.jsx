import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Star,
  Image as ImageIcon,
  X,
  ThumbsUp,
  Smile,
  Send,
  ChevronDown,
  ChevronUp,
  Filter,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Axios from "../utils/AxiosUser";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";

const CommentUser = ({ productId, comments, setComments }) => {
  const currentUser = useSelector((state) => state.user);
  const fileInputRef = useRef(null);
  const [newComment, setNewComment] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [visibleComments, setVisibleComments] = useState(5);
  const [selectedRatingFilter, setSelectedRatingFilter] = useState(0);
  const [showRatingFilter, setShowRatingFilter] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [likedComments, setLikedComments] = useState([]);

  const emojiIcons = [
    "😍",
    "👍",
    "❤️",
    "🔥",
    "⭐",
    "👌",
    "😊",
    "🎉",
    "🤩",
    "💯",
    "🚀",
    "✨",
    "😂",
    "😋",
    "👏",
    "🙌",
  ];

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await Axios.get(`/api/reviews/${productId}`);
        if (res.data.success) {
          setComments(res.data.data);
        }
      } catch (err) {
        console.error("Lỗi khi fetch reviews:", err);
      }
    };

    fetchReviews();
  }, [productId, setComments]);

  useEffect(() => {
    if (!currentUser?._id) return;
    const likedIds = comments
      .filter((c) => c.likes.includes(currentUser._id))
      .map((c) => c._id);
    setLikedComments(likedIds);
  }, [comments, currentUser]);

  const handleLike = async (commentId) => {
    try {
      const res = await Axios.post(`/api/reviews/like/${commentId}`);
      if (res.data.success) {
        const updatedComment = res.data.data;

        setComments((prev) =>
          prev.map((c) => (c._id === commentId ? updatedComment : c))
        );
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const filteredComments =
    selectedRatingFilter === 0
      ? comments
      : comments.filter((comment) => comment.rating === selectedRatingFilter);

  const displayedComments = filteredComments.slice(0, visibleComments);

  const ratingStats = {
    average:
      comments.length > 0
        ? (
            comments.reduce((acc, cur) => acc + cur.rating, 0) / comments.length
          ).toFixed(1)
        : 0,
    total: comments.length,
    distribution: [1, 2, 3, 4, 5].map(
      (star) => comments.filter((comment) => comment.rating === star).length
    ),
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
      formData.append("product", productId);
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
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const loadMoreComments = () => {
    setVisibleComments((prev) => prev + 5);
  };

  const collapseComments = () => {
    setVisibleComments(5);
  };

  const addEmoji = (emoji) => {
    setNewComment((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const openImageViewer = (imageUrl, images = []) => {
    setSelectedImage({ current: imageUrl, all: images });
    setZoomLevel(1);
    setRotation(0);
  };

  const closeImageViewer = () => {
    setSelectedImage(null);
    setZoomLevel(1);
    setRotation(0);
  };

  const handleZoom = (direction) => {
    setZoomLevel((prev) => {
      const newZoom = direction === "in" ? prev + 0.25 : prev - 0.25;
      return Math.max(0.5, Math.min(3, newZoom));
    });
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const downloadImage = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `review-image-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Đã tải ảnh xuống");
    } catch (error) {
      toast.error("Lỗi khi tải ảnh xuống");
    }
  };

  const navigateImage = (direction) => {
    if (!selectedImage?.all || selectedImage.all.length <= 1) return;

    const currentIndex = selectedImage.all.indexOf(selectedImage.current);
    let newIndex;

    if (direction === "next") {
      newIndex = (currentIndex + 1) % selectedImage.all.length;
    } else {
      newIndex =
        (currentIndex - 1 + selectedImage.all.length) %
        selectedImage.all.length;
    }

    setSelectedImage((prev) => ({
      ...prev,
      current: selectedImage.all[newIndex],
    }));
    setZoomLevel(1);
    setRotation(0);
  };

  const ratingFilterOptions = [
    { value: 0, label: "Tất cả đánh giá", count: comments.length },
    { value: 5, label: "5 sao", count: ratingStats.distribution[4] },
    { value: 4, label: "4 sao", count: ratingStats.distribution[3] },
    { value: 3, label: "3 sao", count: ratingStats.distribution[2] },
    { value: 2, label: "2 sao", count: ratingStats.distribution[1] },
    { value: 1, label: "1 sao", count: ratingStats.distribution[0] },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full w-full h-full flex items-center justify-center">
            <button
              onClick={closeImageViewer}
              className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors backdrop-blur-sm"
            >
              <X className="w-6 h-6" />
            </button>

            {selectedImage.all && selectedImage.all.length > 1 && (
              <>
                <button
                  onClick={() => navigateImage("prev")}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors backdrop-blur-sm"
                >
                  <ChevronDown className="w-6 h-6 rotate-90" />
                </button>
                <button
                  onClick={() => navigateImage("next")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors backdrop-blur-sm"
                >
                  <ChevronDown className="w-6 h-6 -rotate-90" />
                </button>
              </>
            )}

            {selectedImage.all && selectedImage.all.length > 1 && (
              <div className="absolute top-4 left-4 z-10 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                {selectedImage.all.indexOf(selectedImage.current) + 1} /{" "}
                {selectedImage.all.length}
              </div>
            )}

            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={selectedImage.current}
                alt="Review image"
                className="max-w-full max-h-full object-contain transition-transform duration-200"
                style={{
                  transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                }}
              />
            </div>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-4">
              <button
                onClick={() => handleZoom("out")}
                disabled={zoomLevel <= 0.5}
                className="text-white p-2 hover:bg-white/20 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ZoomOut className="w-5 h-5" />
              </button>

              <button
                onClick={() => setZoomLevel(1)}
                className="text-white px-3 py-1 text-sm hover:bg-white/20 rounded transition-colors"
              >
                {Math.round(zoomLevel * 100)}%
              </button>

              <button
                onClick={() => handleZoom("in")}
                disabled={zoomLevel >= 3}
                className="text-white p-2 hover:bg-white/20 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ZoomIn className="w-5 h-5" />
              </button>

              <button
                onClick={handleRotate}
                className="text-white p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <RotateCw className="w-5 h-5" />
              </button>

              <button
                onClick={() => downloadImage(selectedImage.current)}
                className="text-white p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="border-b border-gray-100">
        <div className="px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Đánh giá sản phẩm
              </h2>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-lg">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-semibold text-gray-900">
                    {ratingStats.average}
                  </span>
                </div>
                <span className="text-gray-400">•</span>
                <span>{ratingStats.total} đánh giá</span>
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowRatingFilter(!showRatingFilter)}
                className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>
                  {
                    ratingFilterOptions.find(
                      (opt) => opt.value === selectedRatingFilter
                    )?.label
                  }
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {showRatingFilter && (
                <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  {ratingFilterOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSelectedRatingFilter(option.value);
                        setShowRatingFilter(false);
                        setVisibleComments(5);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                        selectedRatingFilter === option.value
                          ? "bg-red-50 text-red-600 font-medium"
                          : "text-gray-700"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{option.label}</span>
                        <span className="text-gray-500 text-xs">
                          ({option.count})
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* <div className="p-4 border-b border-gray-100">
        <div className="flex gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 mb-3 text-sm">
              Thêm đánh giá
            </h3>

   
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-gray-600 font-medium">
                Đánh giá:
              </span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-transform hover:scale-110 transform duration-200"
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
                className="w-full border border-gray-300 rounded-lg p-3 pr-10 resize-none focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-100 text-sm min-h-[80px] transition-colors"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="absolute right-3 bottom-3 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Smile className="w-4 h-4" />
              </button>


              {showEmojiPicker && (
                <div className="absolute right-0 bottom-12 bg-white border border-gray-200 rounded-lg shadow-lg p-3 w-64 z-10">
                  <div className="grid grid-cols-8 gap-1">
                    {emojiIcons.map((emoji, index) => (
                      <button
                        key={index}
                        onClick={() => addEmoji(emoji)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded transition-colors text-lg"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>


            {attachments.length > 0 && (
              <div className="flex gap-2 mb-3 flex-wrap">
                {attachments.map((attachment, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={attachment.url}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded-lg border border-gray-200 group-hover:border-red-300 transition-colors cursor-pointer"
                      onClick={() =>
                        openImageViewer(
                          attachment.url,
                          attachments.map((a) => a.url)
                        )
                      }
                    />
                    <button
                      onClick={() => removeAttachment(index)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors shadow-sm"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

        
            <div className="flex items-center justify-between">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 px-3 py-1.5 text-gray-600 hover:text-gray-800 transition-colors text-xs font-medium bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                <ImageIcon className="w-4 h-4" />
                <span>Ảnh</span>
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
                className="flex items-center gap-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-1.5 rounded-lg font-medium transition-all duration-200 text-xs"
              >
                <Send className="w-3 h-3" />
                Gửi
              </button>
            </div>
          </div>
        </div>
      </div> */}

      <div className="p-4">
        <div className="space-y-4">
          {displayedComments.map((comment) => (
            <div
              key={comment._id}
              className="flex gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
            >
              <div
                className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-xs flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() =>
                  comment.user?.profile_image &&
                  openImageViewer(comment.user.profile_image)
                }
              >
                {comment.user?.profile_image ? (
                  <img
                    src={comment.user.profile_image}
                    alt={comment.user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  comment.user?.name?.charAt(0) || "U"
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h4 className="font-medium text-gray-900 text-sm">
                    {comment.user?.name}
                  </h4>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3 h-3 ${
                          star <= comment.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                <p className="text-gray-700 text-sm mb-2 leading-relaxed">
                  {comment.comment}
                </p>

                {comment.photos && comment.photos.length > 0 && (
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {comment.photos.map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt="Review attachment"
                        className="w-14 h-14 object-cover rounded-lg border border-gray-200 cursor-pointer hover:border-red-300 transition-colors hover:scale-105 transform duration-200"
                        onClick={() => openImageViewer(url, comment.photos)}
                      />
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-4 mt-3">
                  <button
                    onClick={() => handleLike(comment._id)}
                    className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${
                      comment.likes.includes(currentUser._id)
                        ? "text-red-500"
                        : "text-gray-600"
                    }`}
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>Thích</span>
                    <span className="text-gray-500 text-xs">
                      {comment.likes.length}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredComments.length > 5 && (
            <div className="flex justify-center pt-4">
              {visibleComments < filteredComments.length ? (
                <button
                  onClick={loadMoreComments}
                  className="flex items-center gap-1 px-4 py-2 text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
                >
                  Xem thêm{" "}
                  {Math.min(5, filteredComments.length - visibleComments)} đánh
                  giá
                  <ChevronDown className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={collapseComments}
                  className="flex items-center gap-1 px-4 py-2 text-sm text-gray-600 hover:text-gray-700 font-medium transition-colors"
                >
                  Thu gọn
                  <ChevronUp className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {displayedComments.length === 0 && (
            <div className="text-center py-20 text-gray-500 text-sm">
              {selectedRatingFilter === 0
                ? "Chưa có đánh giá nào cho sản phẩm này"
                : `Chưa có đánh giá ${selectedRatingFilter} sao nào`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentUser;
