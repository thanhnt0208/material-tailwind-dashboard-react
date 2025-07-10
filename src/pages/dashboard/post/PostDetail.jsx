import React, {useEffect, useState} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Button, Chip, Avatar } from "@material-tailwind/react";
const BASE_URL = 'https://api-ndolv2.nongdanonline.vn';

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
            <Button onClick={() => navigate(-1)} variant="outlined" size="sm" className="mb-4">
                ← Quay lại
            </Button>

            <Typography variant="h4" className="mb-2">{post.title}</Typography>
            <Typography variant="paragraph" className="mb-4">{post.description}</Typography>

            <div className="flex gap-2 mb-4">
                {post.tags?.map((tag, i) => (
                <Chip key={i} value={tag} color="blue-gray" size="sm" />
                ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                {post.images.map((img, i) => (
                <img
                    key={i}
                    src={`${BASE_URL}${img}`}
                    alt={`img-${i}`}
                    className="w-full h-40 object-cover rounded"
                />
                ))}
            </div>

            <div className="flex items-center gap-2 mb-4">
                {/* <Avatar src={post.authorId?.avatar} alt={post.authorId?.fullName} size="sm" /> */}
                <span>{post.authorId}</span>
            </div>

            <Typography className="mb-2">Lượt thích: {post.like}</Typography>
            <Chip
                value={post.status ? "Đang hoạt động" : "Đã ẩn"}
                color={post.status ? "green" : "red"}
                size="sm"
            />
        </div>
  );
}

export default PostDetail;