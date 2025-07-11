import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Button, Chip, Avatar, Tooltip } from "@material-tailwind/react";
import CommentPostbyIdPost from "../AdminCommentPost/CommentPostbyIdPost";
const BASE_URL = 'https://api-ndolv2.nongdanonline.cc';

export function PostDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${BASE_URL}/admin-post-feed/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                const json = await res.json();
                console.log("RESPONSE:", res.status, json);
                if(res.ok) {
                    setPost(json);
                }else{
                    alert(json.message || "không thể lấy bài viết");
                }
            } catch (error) {
                console.error("fetch post lỗi: ", error);
                alert("Lỗi khi lấy dữ liệu bài post");
            } finally {
                setLoading(false)
            }
        };
        fetchPost();
    },[id])
    if (loading) return <Typography>Đang tải dữ liệu...</Typography>;
    if (!post) return <Typography>Không tìm thấy bài viết</Typography>;

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
            <div className="mt-10">
                <Typography variant="h5" className="mb-2">Bình luận bài viết</Typography>
                <CommentPostbyIdPost />
            </div>
        </div>
  );
}

export default PostDetail;
