import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Avatar,
  Chip,
  Dialog,
  DialogHeader,
  DialogBody,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import { Audio } from "react-loader-spinner";

const BASE_URL = "https://api-ndolv2.nongdanonline.cc";

export default function PostDetailDialog({ postId, open, onClose }) {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(true);
  const [showComments, setShowComments] = useState(false);

  const token = localStorage.getItem("token");

  const fetchPost = async () => {
    try {
      const res = await fetch(`${BASE_URL}/admin-post-feed/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const json = await res.json();
      if (res.ok) {
        setPost(json);
      } else {
        alert(json.message || "Không thể lấy bài viết");
      }
    } catch (err) {
      console.error(" Fetch post error:", err);
      alert("Lỗi khi lấy dữ liệu bài viết");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`${BASE_URL}/admin-comment-post/post/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (res.ok) {
        setComments(Array.isArray(json.comments) ? json.comments : []);
      }
    } catch (err) {
      console.error(" Fetch comments error:", err);
    } finally {
      setCommentLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${BASE_URL}/admin-users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (res.ok && Array.isArray(json)) {
        setUsers(json);
      } else if (res.ok && Array.isArray(json.data)) {
        setUsers(json.data);
      }
    } catch (err) {
      console.error(" Fetch users error:", err);
    }
  };

  useEffect(() => {
    if (open) {
      fetchPost();
      fetchComments();
      fetchUsers();
      setShowComments(false);
    }
  }, [postId, open]);

  const findUser = (userId) =>
    users.find((u) => u.id === userId) || post?.authorId;

  const formatDateTime = (dateString) => {
    if (!dateString) return "Không rõ";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN");
  };

  return (
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
    <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow">
     
      {/* Tiêu đề */}
      <Typography variant="h4" className="font-bold mb-2 text-black-800">
        Tiêu đề: {post.title}
      </Typography>
=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
    <Dialog open={open} handler={onClose} size="xl">
      <DialogHeader className="flex justify-between">
        <Typography variant="h5">Chi tiết bài viết</Typography>
        <Button size="sm" onClick={onClose}>
          Đóng
        </Button>
      </DialogHeader>
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream

      <DialogBody className="max-h-[75vh] overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-60">
            <Audio height="80" width="80" color="green" ariaLabel="loading" />
          </div>
        ) : !post ? (
          <Typography className="text-center">
            Không tìm thấy bài viết
          </Typography>
        ) : (
          <>
            {/* Tiêu đề */}
            <Typography variant="h4" className="font-bold mb-2 text-black-800">
              {post.title}
            </Typography>
>>>>>>> Stashed changes

            {/* Ngày tạo và cập nhật */}
            <div className="text-sm text-gray-600 mb-4">
              <p>🗓️ <b>Ngày tạo:</b> {formatDateTime(post.createdAt)}</p>
              <p>🔄 <b>Cập nhật gần nhất:</b> {formatDateTime(post.updatedAt)}</p>
            </div>

=======

      <DialogBody className="max-h-[75vh] overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-60">
            <Audio height="80" width="80" color="green" ariaLabel="loading" />
          </div>
        ) : !post ? (
          <Typography className="text-center">
            Không tìm thấy bài viết
          </Typography>
        ) : (
          <>
            {/* Tiêu đề */}
            <Typography variant="h4" className="font-bold mb-2 text-black-800">
              {post.title}
            </Typography>

            {/* Ngày tạo và cập nhật */}
            <div className="text-sm text-gray-600 mb-4">
              <p>🗓️ <b>Ngày tạo:</b> {formatDateTime(post.createdAt)}</p>
              <p>🔄 <b>Cập nhật gần nhất:</b> {formatDateTime(post.updatedAt)}</p>
            </div>

>>>>>>> Stashed changes
=======

      <DialogBody className="max-h-[75vh] overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-60">
            <Audio height="80" width="80" color="green" ariaLabel="loading" />
          </div>
        ) : !post ? (
          <Typography className="text-center">
            Không tìm thấy bài viết
          </Typography>
        ) : (
          <>
            {/* Tiêu đề */}
            <Typography variant="h4" className="font-bold mb-2 text-black-800">
              {post.title}
            </Typography>

            {/* Ngày tạo và cập nhật */}
            <div className="text-sm text-gray-600 mb-4">
              <p>🗓️ <b>Ngày tạo:</b> {formatDateTime(post.createdAt)}</p>
              <p>🔄 <b>Cập nhật gần nhất:</b> {formatDateTime(post.updatedAt)}</p>
            </div>

>>>>>>> Stashed changes
=======

      <DialogBody className="max-h-[75vh] overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-60">
            <Audio height="80" width="80" color="green" ariaLabel="loading" />
          </div>
        ) : !post ? (
          <Typography className="text-center">
            Không tìm thấy bài viết
          </Typography>
        ) : (
          <>
            {/* Tiêu đề */}
            <Typography variant="h4" className="font-bold mb-2 text-black-800">
              {post.title}
            </Typography>

            {/* Ngày tạo và cập nhật */}
            <div className="text-sm text-gray-600 mb-4">
              <p>🗓️ <b>Ngày tạo:</b> {formatDateTime(post.createdAt)}</p>
              <p>🔄 <b>Cập nhật gần nhất:</b> {formatDateTime(post.updatedAt)}</p>
            </div>

>>>>>>> Stashed changes
            {/* Tác giả */}
            <div className="flex items-center gap-3 mb-4">
              <Typography className="font-semibold text-gray-700">Tác giả:</Typography>
              <Avatar
                src={
                  findUser(post.authorId)?.avatar?.startsWith("http")
                    ? findUser(post.authorId).avatar
                    : `${BASE_URL}${findUser(post.authorId)?.avatar || ""}`
                }
                alt={findUser(post.authorId)?.fullName}
              />
              <Typography>{findUser(post.authorId)?.fullName || "Không rõ"}</Typography>
            </div>

            {/* Mô tả */}
            <Typography className="mb-3">
              <b>Mô tả:</b> {post.description}
            </Typography>

            {/* Tags */}
            <div className="flex gap-2 flex-wrap mb-4">
              <Typography className="font-semibold text-gray-700">Tags:</Typography>
              {post.tags?.map((tag, idx) => (
                <Chip key={idx} value={tag} color="blue-gray" size="sm" />
              ))}
            </div>

            {/* Hình ảnh */}
            <div className="mb-2 font-semibold text-gray-700">Hình ảnh:</div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              {post.images?.map((img, idx) => (
                <img
                  key={idx}
                  src={`${BASE_URL}${img}`}
                  alt={`img-${idx}`}
                  className="w-full h-40 object-cover rounded shadow"
                />
              ))}
            </div>

            {/* Bình luận */}
            <div className="border-t pt-4 mt-6">
              <div
                className="cursor-pointer mb-2" 
                onClick={() => setShowComments(!showComments)} 
              >
                <Typography variant="h5" className="text-blue-800">
                  Bình luận
                </Typography>
                {showComments && (
                  <>
                    {commentLoading ? (
                      <Typography>Đang tải bình luận...</Typography>
                    ) : comments.length > 0 ? (
                      comments.map((cmt) => (
  <div key={cmt._id} className="border-b py-3 flex items-start gap-3">
    <Avatar
      src={
        cmt.userId?.avatar?.startsWith("http")
          ? cmt.userId.avatar
          : `${BASE_URL}${cmt.userId?.avatar || ""}`
      }
      alt={cmt.userId?.fullName}
    />
    <div className="flex-1">
      <div className="flex justify-between">
        <Typography className="font-medium">
          {cmt.userId?.fullName || "Ẩn danh"}
        </Typography>
      </div>
      <Typography className="text-gray-700">{cmt.comment}</Typography>

      {/* Replies */}
      {cmt.replies?.length > 0 && (
        <div className="ml-4 mt-2 border-l-2 pl-2 border-blue-200">
          {cmt.replies.map((rep) => (
            <div
              key={rep._id}
              className="flex items-start gap-2 mt-1"
            >
              <Avatar
                src={
                  rep.userId?.avatar?.startsWith("http")
                    ? rep.userId.avatar
                    : `${BASE_URL}${rep.userId?.avatar || ""}`
                }
                alt={rep.userId?.fullName}
                size="xs"
              />
              <div className="flex-1">
                <div className="flex justify-between">
                  <Typography className="font-semibold">
                    {rep.userId?.fullName || "Ẩn danh"}:
                  </Typography>
                </div>
                <Typography className="text-sm">{rep.comment}</Typography>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
))
                    ) : (
                      <Typography>Không có bình luận</Typography>
                    )}
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </DialogBody>
    </Dialog>
  );
}
