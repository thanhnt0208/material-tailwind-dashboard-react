import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  Avatar,
  Chip,
  Dialog,
  Input,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://api-ndolv2.nongdanonline.cc";

export function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const navigate = useNavigate();

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
        console.warn("Danh sách users không hợp lệ:", json);
        setUsers([]);
      }
    } catch (err) {
      console.error("Fetch users error:", err);
      setUsers([]);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const limit = 10;
    const totalToFetch = 100;
    const totalPagesToFetch = Math.ceil(totalToFetch / limit);

    try {
      const fetchPage = async (page) => {
        const res = await fetch(`${BASE_URL}/admin-post-feed?page=${page}&limit=${limit}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const json = await res.json();
        if (res.ok) return json.data || [];
        else throw new Error(json.message || "Lỗi khi gọi API trang " + page);
      };

      const allPages = await Promise.all(
        Array.from({ length: totalPagesToFetch }, (_, i) => fetchPage(i + 1))
      );

      const allPosts = allPages.flat();

      const withCommentCounts = await Promise.all(
        allPosts.map(async (post) => {
          const postId = post._id || post.id;
          try {
            const res = await fetch(`${BASE_URL}/admin-comment-post/post/${postId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const json = await res.json();
            const comments = Array.isArray(json.data) ? json.data : [];
            return { ...post, id: postId, commentCount: comments.length };
          } catch (err) {
            console.warn("Lỗi khi lấy comment cho post:", postId, err);
            return { ...post, id: postId, commentCount: 0 };
          }
        })
      );
      console.log("📥 Data fetch xong:", withCommentCounts);
      setPosts(withCommentCounts);
    } catch (err) {
      console.error("Fetch posts error:", err);
      alert("Không thể lấy danh sách bài viết: " + err.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
    fetchPosts();
  }, []);

  const findUser = (id) => users.find((u) => u.id === id);

  const handleEditClick = (post) => {
  setSelectedPost({
    ...post,
    tagsInput: Array.isArray(post.tags) ? post.tags.join(", ") : "",
  });
  setOpenEdit(true);
};


  const updatePost = async () => {
  try {
    const token = localStorage.getItem("token");


    const payload = {
      title: selectedPost.title,
      description: selectedPost.description,
      status: Boolean(selectedPost.status), 
      tags: (selectedPost.tagsInput || "")
        .split(",") 
        .map((tag) => tag.trim()) 
        .filter((tag) => tag !== ""), 
      images: selectedPost.images,
      authorId: selectedPost.authorId,
    };

    console.log("👉 Payload gửi PUT:", payload);  

    const res = await fetch(`${BASE_URL}/admin-post-feed/${selectedPost.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (res.ok) {
      alert(" Cập nhật thành công!");

      setPosts((prevPosts) =>
      prevPosts.map((p) =>
        p.id === selectedPost.id
          ? {
              ...p,
              title: selectedPost.title,
              description: selectedPost.description,
              tags: selectedPost.tagsInput
                .split(",")
                .map((tag) => tag.trim())
                .filter((tag) => tag !== ""),
              status: selectedPost.status,
              images: selectedPost.images,
            }
          : p
      )
    );
      setSelectedPost(null);
      setOpenEdit(false);

      
      
    } else {
      console.error(" PUT lỗi:", json);
      alert(json.message || " Cập nhật thất bại");
    }
  } catch (err) {
    console.error(" PUT error:", err);
    alert(" Lỗi kết nối server khi cập nhật");
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

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  return (
    <div className="p-4">
      <Typography variant="h4" className="mb-4">
        Danh sách bài post
      </Typography>

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
                {/* <th className="p-2 border">Bình luận</th> */}
                <th className="p-2 border">Trạng thái</th>
                <th className="p-2 border">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentPosts.map((post) => {
                const author = findUser(post.authorId);
                return (
                  <tr
                    key={post.id}
                    onClick={() => navigate(`/dashboard/post/${post.id}`)}
                    className="hover:bg-gray-50 cursor-pointer transition"
                  >
                    <td className="p-2 border">{post.title}</td>
                    <td className="p-2 border max-w-xs align-top">
                      <p className="line-clamp-10 text-sm leading-snug break-words">
                        {post.description.length > 30
                          ? post.description.slice(0, 25) + "..."
                          : post.description || "Không có mô tả"}
                      </p>
                    </td>
                    <td className="p-2 border">
                      {Array.isArray(post.tags) && post.tags.length > 0 && (
                        <div className="flex items-center gap-1">
                          <div className="px-1 py-0.5 text-s bg-gray-200 rounded">
                            {post.tags[0]}
                          </div>
                          {post.tags.length > 1 && (
                            <span className="text-xs text-gray-500">
                              +{post.tags.length - 1}
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="p-2 border">
                      {post.images?.length > 0 ? (
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
                      {author ? (
                        <span>{author.fullName}</span>
                      ) : (
                        <span>Không rõ</span>
                      )}
                    </td>
                    <td className="p-2 border">{post.like}</td>
                    {/* <td className="p-2 border">{post.commentCount ?? 0}</td> */}
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
                        onClick={(e) => {
                          e.stopPropagation();
                          deletePost(post.id);
                        }}
                      >
                        Xoá
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {posts.length === 0 && (
                <tr>
                  <td colSpan="9" className="p-2 text-center">
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex justify-center mt-4 gap-2">
            <Button
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Trước
            </Button>
            {[...Array(totalPages)].map((_, i) => (
              <Button
                key={i}
                size="sm"
                color={currentPage === i + 1 ? "blue" : "gray"}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Sau
            </Button>
          </div>
        </div>
      )}

      <Dialog open={openEdit} handler={() => setOpenEdit(false)}>
        <div className="p-6 space-y-4 mx-auto max-w-md bg-white rounded-lg shadow-lg">
          <Typography variant="h5">Cập nhật bài post</Typography>

          <Input
            label="Tiêu đề"
            value={selectedPost?.title || ""}
            onChange={(e) =>
              setSelectedPost({ ...selectedPost, title: e.target.value })
            }
          />

          <textarea
            className="border p-2 w-full rounded h-32 resize-y"
            placeholder="Mô tả"
            value={selectedPost?.description || ""}
            onChange={(e) => setSelectedPost({ ...selectedPost, description: e.target.value })}
          />

          {/* Tags */}
          <Input
          label="Tags (ngăn cách bởi dấu phẩy)"
          value={selectedPost?.tagsInput || ""}
          onChange={(e) =>
            setSelectedPost({
              ...selectedPost,
              tagsInput: e.target.value, 
            })
            }
          />

          {/* Hình ảnh */}
          <Input
            label="Link hình ảnh (từ thư mục /uploads/post/...)"
            value={selectedPost?.images?.[0] || ""}
            onChange={(e) =>
              setSelectedPost({ ...selectedPost, images: [e.target.value] }) 
            }
          />


          <div>
            <Typography variant="small" color="gray">
              Tác giả
            </Typography>
            <Typography
              variant="paragraph"
              className="p-2 border rounded bg-gray-50"
            >
              {selectedPost?.authorId
                ? users.find((u) => u.id === selectedPost.authorId)?.fullName || "Không rõ"
                : "Không rõ"}
            </Typography>
          </div>

          <select
            className="border p-2 w-full rounded"
            value={selectedPost?.status}
            onChange={(e) =>
              setSelectedPost({
                ...selectedPost,
                status: e.target.value === "true",
              })
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
