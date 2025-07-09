import React, { useEffect, useState } from "react";
import { Button, Typography, Avatar, Chip } from "@material-tailwind/react";

const BASE_URL = "https://api-ndolv2.nongdanonline.vn"; 

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Lấy danh sách bài post
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/admin-post-feed`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();
      if (res.ok) {
        setPosts(json.data);
      } else {
        alert(json.message || "Lỗi khi lấy danh sách bài post");
      }
    } catch (err) {
      console.error("Fetch posts error:", err);
      alert("Không thể kết nối tới server");
    }
    setLoading(false);
  };

  // Xoá bài post
  const deletePost = async (id) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xoá bài post này?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/admin-post-feed/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        alert("Xoá thành công!");
        setPosts(posts.filter((post) => post.id !== id)); 
      } else {
        const json = await res.json();
        alert(json.message || "Xoá thất bại");
      }
    } catch (err) {
      console.error("Delete post error:", err);
      alert("Không thể kết nối tới server");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="p-4">
      <Typography variant="h4" className="mb-4">Danh sách bài post</Typography>

      {loading ? (
        <Typography>Đang tải dữ liệu...</Typography>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border border-gray-200 rounded">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Tiêu đề</th>
                <th className="p-2 border">Mô tả</th>
                <th className="p-2 border">Tags</th>
                <th className="p-2 border">Hình</th>
                <th className="p-2 border">Tác giả</th>
                <th className="p-2 border">Like</th>
                <th className="p-2 border">Trạng thái</th>
                <th className="p-2 border">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="p-2 border">{post.title}</td>
                  <td className="p-2 border line-clamp-2">{post.description}</td>
                  <td className="p-2 border">
                    {post.tags.map((tag, index) => (
                      <Chip key={index} value={tag} size="sm" className="mr-1" />
                    ))}
                  </td>
                  <td className="p-2 border">
                    {post.images.length > 0 ? (
                      <img
                        src={post.images[0]}
                        alt="Hình ảnh"
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      "Không có"
                    )}
                  </td>
                  <td className="p-2 border flex items-center gap-2">
                    <Avatar
                      src={post.authorId.avatar}
                      alt={post.authorId.fullName}
                      size="sm"
                    />
                    <span>{post.authorId.fullName}</span>
                  </td>
                  <td className="p-2 border">{post.like}</td>
                  <td className="p-2 border">
                    <Chip
                      value={post.status ? "Đang hoạt động" : "Đã ẩn"}
                      color={post.status ? "green" : "red"}
                      size="sm"
                    />
                  </td>
                  <td className="p-2 border">
                    <Button
                      color="red"
                      size="sm"
                      onClick={() => deletePost(post.id)}
                    >
                      Xoá
                    </Button>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan="9" className="p-2 text-center">
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
