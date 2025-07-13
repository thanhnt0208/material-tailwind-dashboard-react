import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  Avatar,
  Chip,
  Dialog,
  Input,
} from "@material-tailwind/react";
import PostDetailDialog from "./PostDetail";
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

  const [filterUserId, setFilterUserId] = useState(""); 
  const [filterTitle, setFilterTitle] = useState(""); 
  const [filterSortLikes, setFilterSortLikes] = useState(""); 
  const [filterSortComments, setFilterSortComments] = useState(""); 
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [filterTag, setFilterTag] = useState(""); 
  const [filterStatus, setFilterStatus] = useState("");

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

    const resComments = await fetch(`${BASE_URL}/admin-comment-post`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const jsonComments = await resComments.json();
    const allComments = Array.isArray(jsonComments.data) ? jsonComments.data : [];

    const commentCountMap = allComments.reduce((acc, commentGroup) => {
      const postId = commentGroup.postId;

      
      const parentCount = Array.isArray(commentGroup.comments)
        ? commentGroup.comments.length
        : 0;

      
      const replyCount = commentGroup.comments.reduce((sum, cmt) => {
        return sum + (Array.isArray(cmt.replies) ? cmt.replies.length : 0);
      }, 0);

      
      acc[postId] = parentCount + replyCount;
      return acc;
    }, {});

     const withCommentCounts = allPosts.map((post) => ({
      ...post,
      id: post._id || post.id,
      commentCount: commentCountMap[post._id || post.id] || 0, 
    }));


    console.log(" Data fetch xong:", withCommentCounts);
    setPosts(withCommentCounts);
  } catch (err) {
    console.error("Fetch posts error:", err);
    alert("Không thể lấy danh sách bài viết: " + err.message);
  }

  setLoading(false);
};

const fetchPostsByUser = async ({ userId, title, tags, status, sortLikes, sortComments, page = 1, limit = 10 }) => {
    setLoading(true);
  const token = localStorage.getItem("token");

  const queryParams = new URLSearchParams();
  if (title) queryParams.append("title", title);
  if (status) queryParams.append("status", status);
  if (userId) queryParams.append("authorId", userId);
  if (sortLikes) queryParams.append("sortLikes", sortLikes);
  if (sortComments) queryParams.append("sortComments", sortComments);
  if (tags && tags.length > 0) tags.forEach(tag => queryParams.append("tags", tag));
  queryParams.append("page", page);
  queryParams.append("limit", limit);

  try {
    const res = await fetch(`${BASE_URL}/admin-post-feed?${queryParams.toString()}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const json = await res.json();
    const fetchedPosts = json.data || [];

    const resComments = await fetch(`${BASE_URL}/admin-comment-post`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const jsonComments = await resComments.json();
    const allComments = Array.isArray(jsonComments.data) ? jsonComments.data : [];

    const commentCountMap = allComments.reduce((acc, commentGroup) => {
      const postId = commentGroup.postId;
      const parentCount = Array.isArray(commentGroup.comments) ? commentGroup.comments.length : 0;
      const replyCount = commentGroup.comments.reduce((sum, cmt) => {
        return sum + (Array.isArray(cmt.replies) ? cmt.replies.length : 0);
      }, 0);
      acc[postId] = parentCount + replyCount;
      return acc;
    }, {});

    const withCommentCounts = fetchedPosts.map((post) => ({
      ...post,
      id: post._id || post.id,
      commentCount: commentCountMap[post._id || post.id] || 0,
    }));

    setPosts(withCommentCounts);
  } catch (err) {
    console.error("Lỗi khi lọc post:", err);
    alert("Lỗi khi lọc bài viết: " + err.message);
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

      <div className="flex flex-wrap items-end gap-2 mb-4">
        <Input
          label="User ID"
          value={filterUserId}
          onChange={(e) => setFilterUserId(e.target.value)}
          className="min-w-[150px]"
        />
        <Input
          label="Title"
          value={filterTitle}
          onChange={(e) => setFilterTitle(e.target.value)}
          className="min-w-[150px]"
        />

        
        {/* <div className="flex flex-col">
          <label className="text-sm text-gray-700">Trạng thái</label>
          <select
            className="border h-10 rounded px-2 text-sm"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="draft">Nháp</option>
            <option value="pending">Chờ duyệt</option>
            <option value="published">Đã đăng</option>
            <option value="archived">Đã lưu trữ</option>
          </select>
        </div>

        
        <div className="flex flex-col">
          <label className="text-sm text-gray-700">Sắp xếp Like</label>
          <select
            className="border h-10 rounded px-2 text-sm"
            value={filterSortLikes}
            onChange={(e) => setFilterSortLikes(e.target.value)}
          >
            <option value="">---</option>
            <option value="asc">Tăng dần</option>
            <option value="desc">Giảm dần</option>
          </select>
        </div>

        
        <div className="flex flex-col">
          <label className="text-sm text-gray-700">Sắp xếp Bình luận</label>
          <select
            className="border h-10 rounded px-2 text-sm"
            value={filterSortComments}
            onChange={(e) => setFilterSortComments(e.target.value)}
          >
            <option value="">---</option>
            <option value="asc">Tăng dần</option>
            <option value="desc">Giảm dần</option>
          </select>
        </div> */}

        {/* 🔵 Button Lọc + Xoá */}
        <div className="flex gap-2">
          <Button
            color="blue"
            className="h-10"
            onClick={() =>
              fetchPostsByUser({
                userId: filterUserId,
                page: 1,
                limit: postsPerPage,
                title: filterTitle,
                status: filterStatus,
                sortLikes: filterSortLikes,
                sortComments: filterSortComments,
                tags: filterTag ? [filterTag] : [],
              })
            }
          >
            LỌC
          </Button>
          <Button
            color="black"
            className="h-10"
            onClick={() => {
              setFilterUserId("");
              setFilterTitle("");
              setFilterStatus("");
              setFilterSortLikes("");
              setFilterSortComments("");
              fetchPosts();
            }}
          >
            XOÁ BỘ LỌC
          </Button>
        </div>
      </div>


      {loading ? (
        <Typography>Đang tải dữ liệu...</Typography>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border border-gray-200 rounded">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border w-44">Tiêu đề</th>
                <th className="p-2 border">Mô tả</th>
                <th className="p-2 border w-28">Tags</th>
                <th className="p-2 border w-28">Hình</th>
                <th className="p-2 border w-28">Tác giả</th>
                <th className="p-2 border w-20 text-center">Like</th>
                <th className="p-2 border w-24">Bình luận</th>
                <th className="p-2 border w-36">Trạng thái</th>
                <th className="p-2 border w-40  ">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentPosts.map((post) => {
                const author = findUser(post.authorId);
                return (
                  <tr
                    key={post.id}
                    onClick={() => {setSelectedPostId(post.id); setIsDetailOpen(true);}}
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
                    <td className="p-2 border text-center">{post.like}</td>
                    <td className="p-2 border text-center">{post.commentCount ?? 0}</td>
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

      <PostDetailDialog
        postId={selectedPostId}
        open={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </div>
  );
}

export default PostList;
