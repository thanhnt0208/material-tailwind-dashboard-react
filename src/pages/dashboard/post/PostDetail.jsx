import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Button,
  Avatar,
  Chip,
} from "@material-tailwind/react";
import { Audio } from "react-loader-spinner";

const BASE_URL = "https://api-ndolv2.nongdanonline.cc";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(true);

  const token = localStorage.getItem("token");

  // Fetch bài viết
  const fetchPost = async () => {
    try {
      const res = await fetch(`${BASE_URL}/admin-post-feed/${id}`, {
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
      console.error("❌ Fetch post error:", err);
      alert("Lỗi khi lấy dữ liệu bài viết");
    } finally {
      setLoading(false);
    }
  };

  // Fetch bình luận
  const fetchComments = async () => {
    try {
      const res = await fetch(`${BASE_URL}/admin-comment-post/post/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (res.ok) {
        setComments(json.data || []);
      }
    } catch (err) {
      console.error("❌ Fetch comments error:", err);
    } finally {
      setCommentLoading(false);
    }
  };

  // Fetch users
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
      console.error("❌ Fetch users error:", err);
    }
  };

  useEffect(() => {
    fetchPost();
    fetchComments();
    fetchUsers();
  }, [id]);

  const findUser = (userId) =>
    users.find((u) => u.id === userId) || post?.authorId;

  const formatDateTime = (dateString) => {
    if (!dateString) return "Không rõ";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN"); // Format theo giờ VN
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-60">
        <Audio height="80" width="80" color="green" ariaLabel="loading" />
      </div>
    );

  if (!post)
    return <Typography className="text-center">Không tìm thấy bài viết</Typography>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow">
      {/* Quay lại */}
      <Button
        onClick={() => navigate(-1)}
        variant="outlined"
        className="mb-4"
      >
        ← Quay lại
      </Button>

      {/* Tiêu đề */}
      <Typography variant="h4" className="font-bold mb-2 text-black-800">
        Tiêu đề: {post.title}
      </Typography>

      {/* Ngày tạo và cập nhật */}
      <div className="text-sm text-gray-600 mb-4">
        <p>🗓️ <span className="font-semibold text-gray-700">Ngày tạo:</span> {formatDateTime(post.createdAt)}</p>
        <p>🔄 <span className="font-semibold text-gray-700">Cập nhật gần nhất:</span> {formatDateTime(post.updatedAt)}</p>
      </div>

      {/* Tác giả */}
      <div className="flex items-center gap-3 mb-4">
        <Typography className="font-semibold text-gray-700">
          Tác giả:
        </Typography>
        <Avatar
          src={
            findUser(post.authorId)?.avatar?.startsWith("http")
              ? findUser(post.authorId).avatar
              : `${BASE_URL}${findUser(post.authorId)?.avatar || ""}`
          }
          alt={findUser(post.authorId)?.fullName}
        />
        <Typography className="font-medium">
          {findUser(post.authorId)?.fullName || "Không rõ"}
        </Typography>
      </div>

      {/* Mô tả */}
      <Typography className="mb-3">
        <span className="font-semibold text-gray-700">Mô tả:</span> {post.description}
      </Typography>

      {/* Tags */}
      <div className="flex gap-2 flex-wrap mb-4">
        <Typography className="font-semibold text-gray-700">
          Tags:
        </Typography>
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

      {/* Trạng thái + Lượt thích */}
      <div className="flex items-center gap-4 mb-6">
        <Chip
          value={post.status ? "Đang hoạt động" : "Đã ẩn"}
          color={post.status ? "green" : "red"}
        />
        <Typography>Lượt thích: {post.like}</Typography>
      </div>

      {/* Bình luận */}
      <div className="border-t pt-4 mt-6">
        <Typography variant="h5" className="font-semibold mb-3 text-blue-800">
          Bình luận
        </Typography>
        {commentLoading ? (
          <Typography>Đang tải bình luận...</Typography>
        ) : comments.length > 0 ? (
          comments.map((cmt) => (
            <div
              key={cmt._id}
              className="border-b py-3 flex items-start gap-3"
            >
              <Avatar
                src={
                  cmt.userId?.avatar?.startsWith("http")
                    ? cmt.userId.avatar
                    : `${BASE_URL}${cmt.userId?.avatar || ""}`
                }
                alt={cmt.userId?.fullName}
              />
              <div>
                <Typography className="font-medium">
                  {cmt.userId?.fullName || "Ẩn danh"}
                </Typography>
                <Typography className="text-gray-700">
                  {cmt.comment}
                </Typography>
                {/* Reply */}
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
                        <div>
                          <Typography className="font-semibold">
                            {rep.userId?.fullName || "Ẩn danh"}:
                          </Typography>
                          <Typography className="text-sm">
                            {rep.comment}
                          </Typography>
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
      </div>
    </div>
  );
}
