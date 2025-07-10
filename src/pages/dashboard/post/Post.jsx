import React, { useEffect, useState } from "react";
import { Button, Typography, Avatar, Chip } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { Dialog, Input } from "@material-tailwind/react";

const BASE_URL = "https://api-ndolv2.nongdanonline.vn"; 

export function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const navigate = useNavigate();

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
      console.log("POST DATA:", json.data);
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

  const handleEditClick = (post) => {
  setSelectedPost(post);
  setOpenEdit(true);
  };

  const updatePost = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}/admin-post-feed/${selectedPost.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: selectedPost.title,
        description: selectedPost.description,
        status: selectedPost.status,
      }),
    });

    const json = await res.json();
    if (res.ok) {
      alert("Cập nhật thành công!");
      setOpenEdit(false);
      fetchPosts(); // Reload list
    } else {
      alert(json.message || "Cập nhật thất bại");
    }
  } catch (err) {
    console.error("PUT error:", err);
    alert("Lỗi kết nối server khi cập nhật");
  }
};


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
                <tr 
                key={post.id} 
                onClick={() => navigate(`/dashboard/post/${post.id}`)}
                className="hover:bg-gray-50 cursor-pointer transition">
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
                        src={`${BASE_URL}${post.images[0]}`}
                        alt="Hình ảnh"
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      "Không có"
                    )}
                  </td>
                  <td className="p-2 border flex items-center gap-2">
                    {/* <Avatar
                      src={post.authorId?.avatar}
                      alt={post.authorId?.fullName}
                      size="sm"
                    /> */}
                    <span>{post.authorId}</span>
                  </td>
                  <td className="p-2 border">{post.like}</td>
                  <td className="p-2 border">
                    <Chip
                      value={post.status ? "Đang hoạt động" : "Đã ẩn"}
                      color={post.status ? "green" : "red"}
                      size="sm"
                    />
                  </td>
                  <td className="flex gap-2 p-2 border">

                      <Button
                        color="blue"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(post);
                        }}
                      >
                        Sửa
                    </Button>

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
      <Dialog open={openEdit} handler={() => setOpenEdit(false)}>
        <div className="p-4 space-y-4">
          <Typography variant="h5">Cập nhật bài post</Typography>
          <Input
            label="Tiêu đề"
            value={selectedPost?.title || ""}
            onChange={(e) => setSelectedPost({ ...selectedPost, title: e.target.value })}
          />
          <Input
            label="Mô tả"
            value={selectedPost?.description || ""}
            onChange={(e) => setSelectedPost({ ...selectedPost, description: e.target.value })}
          />
          <select
            className="border p-2 w-full rounded"
            value={selectedPost?.status}
            onChange={(e) =>
              setSelectedPost({ ...selectedPost, status: e.target.value === "true" })
            }
          >
            <option value="true">Đang hoạt động</option>
            <option value="false">Đã ẩn</option>
          </select>
          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setOpenEdit(false)} variant="outlined">
              Hủy
            </Button>
            <Button onClick={updatePost} color="green">
              Lưu thay đổi
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default PostList;