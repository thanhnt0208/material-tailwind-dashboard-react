import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Button, Chip, Avatar, Tooltip } from "@material-tailwind/react";
import CommentPostbyIdPost from "../AdminCommentPost/CommentPostbyIdPost";

const BASE_URL = "https://api-ndolv2.nongdanonline.cc";

export function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [commentedUsers, setCommentedUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/admin-users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (res.ok && Array.isArray(json)) {
          setUsers(json);
        } else if (res.ok && Array.isArray(json.data)) {
          setUsers(json.data);
        } else {
          console.warn("Users response không hợp lệ:", json);
        }
      } catch (err) {
        console.error("Fetch users lỗi:", err);
      }
    };

    const fetchPost = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/admin-post-feed/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const json = await res.json();
        console.log("RESPONSE:", res.status, json);
        if (res.ok) {
          setPost(json);
        } else {
          alert(json.message || "Không thể lấy bài viết");
        }
      } catch (error) {
        console.error("Fetch post lỗi: ", error);
        alert("Lỗi khi lấy dữ liệu bài post");
      } finally {
        setLoading(false);
      }
    };

    
    const fetchCommentedUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/admin-comment-post/post/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (res.ok && Array.isArray(json.data)) {
          // Lấy unique user từ danh sách comment
          const uniqueUsers = [];
          const seen = new Set();
          json.data.forEach((comment) => {
            if (comment.user && !seen.has(comment.user.id)) {
              seen.add(comment.user.id);
              uniqueUsers.push(comment.user);
            }
          });
          setCommentedUsers(uniqueUsers);
        }
      } catch (err) {
        console.error("Fetch commented users lỗi:", err);
      }
    };

    fetchUsers();
    fetchPost();
    fetchCommentedUsers();
  }, [id]);

  const findAuthor = (id) => users.find((u) => u.id === id);

  if (loading) return <Typography>Đang tải dữ liệu...</Typography>;
  if (!post) return <Typography>Không tìm thấy bài viết</Typography>;

  const author = findAuthor(post.authorId);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow">
      <Button
        onClick={() => navigate(-1)}
        variant="outlined"
        size="sm"
        className="mb-4"
      >
        ← Quay lại
      </Button>

      {/* 🔥 TIÊU ĐỀ */}
      <Typography variant="h6" className="text-gray-600 mb-1">
        Tiêu đề
      </Typography>
      <Typography variant="h4" className="mb-4">{post.title}</Typography>

      {/* 🔥 MÔ TẢ */}
      <Typography variant="h6" className="text-gray-600 mb-1">
        Mô tả
      </Typography>
      <Typography variant="paragraph" className="mb-4">
        {post.description}
      </Typography>

      {/* 🔥 TAG */}
      <Typography variant="h6" className="text-gray-600 mb-1">Tag</Typography>
      <div className="flex gap-2 mb-4 flex-wrap">
        {post.tags?.length > 0 ? (
          post.tags.map((tag, i) => (
            <Chip key={i} value={tag} color="blue-gray" size="sm" />
          ))
        ) : (
          <Typography variant="small" color="gray">Không có tag</Typography>
        )}
      </div>

      {/* 🔥 HÌNH ẢNH */}
      <Typography variant="h6" className="text-gray-600 mb-1">Hình ảnh</Typography>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
        {post.images?.length > 0 ? (
          post.images.map((img, i) => (
            <img
              key={i}
              src={`${BASE_URL}${img}`}
              alt={`img-${i}`}
              className="w-full h-40 object-cover rounded"
            />
          ))
        ) : (
          <Typography variant="small" color="gray">Không có hình ảnh</Typography>
        )}
      </div>

      {/* 🔥 TÁC GIẢ */}
      <Typography variant="h6" className="text-gray-600 mb-1">Tác giả</Typography>
      <div className="flex items-center gap-2 mb-4">
        {author ? (
          <>
            <Avatar
              src={`${BASE_URL}${author.avatar}`}
              alt={author.fullName}
              size="sm"
            />
            <span>{author.fullName}</span>
          </>
        ) : (
          <span>Không rõ</span>
        )}
      </div>


      {/* 🔥 AI ĐÃ BÌNH LUẬN */}
      <Typography variant="h6" className="text-gray-600 mb-1">Ai đã bình luận</Typography>
      <div className="flex gap-2 flex-wrap mb-4">
        {commentedUsers.length > 0 ? (
          commentedUsers.map((user, i) => (
            <Tooltip key={i} content={user.fullName}>
              <Avatar
                src={`${BASE_URL}${user.avatar}`}
                alt={user.fullName}
                size="xs"
              />
            </Tooltip>
          ))
        ) : (
          <Typography variant="small" color="gray">Chưa có ai bình luận</Typography>
        )}
      </div>

      {/* 🔥 NGÀY ĐĂNG + SỬA */}
      <div className="text-gray-500 text-sm mb-4">
        <p>Đăng vào: {new Date(post.createdAt).toLocaleString()}</p>
        <p>Sửa lần cuối: {new Date(post.updatedAt).toLocaleString()}</p>
      </div>

    </div>
  );
}

export default PostDetail;
