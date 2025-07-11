// src/pages/dashboard/user/UserDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Typography, Spinner, Avatar, Card, CardBody,
} from "@material-tailwind/react";

export default function UserDetail() {
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [farms, setFarms] = useState([]);
  const [videos, setVideos] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserDetail = async () => {
    try {
      const res = await axios.get(`https://api-ndolv2.nongdanonline.cc/admin-users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error("Error loading user:", err);
    }
  };

  const fetchAddresses = async () => {
    const res = await axios.get("https://api-ndolv2.nongdanonline.cc/user-addresses", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const userAddr = res.data.filter(a => a.userid === id);
    setAddresses(userAddr);
  };

  const fetchFarms = async () => {
    const res = await axios.get("https://api-ndolv2.nongdanonline.cc/farms", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setFarms(res.data.filter(f => f.ownerId === id));
  };

  const fetchVideos = async () => {
    const res = await axios.get("https://api-ndolv2.nongdanonline.cc/videos", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setVideos(res.data.filter(v => v.userId === id));
  };

  const fetchPosts = async () => {
    const res = await axios.get("https://api-ndolv2.nongdanonline.cc/posts", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setPosts(res.data.filter(p => p.userId === id));
  };

  useEffect(() => {
    if (!token) return;
    const loadAll = async () => {
      await fetchUserDetail();
      await fetchAddresses();
      await fetchFarms();
      await fetchVideos();
      await fetchPosts();
      setLoading(false);
    };
    loadAll();
  }, [id]);

  if (loading) return <div className="p-4 text-center"><Spinner /></div>;
  if (!user) return <div className="p-4 text-center text-red-500">Không tìm thấy người dùng</div>;

  return (
    <div className="p-4">
      <Typography variant="h5">Chi tiết người dùng</Typography>
      <div className="flex gap-4 items-center my-4">
        <Avatar src={user.avatar ? `https://api-ndolv2.nongdanonline.cc${user.avatar}` : ""} size="xl" />
        <div>
          <Typography variant="h6">{user.fullName}</Typography>
          <Typography>Email: {user.email}</Typography>
          <Typography>SĐT: {user.phone || "N/A"}</Typography>
          <Typography>Roles: {Array.isArray(user.role) ? user.role.join(", ") : user.role}</Typography>
          <Typography>Trạng thái: {user.isActive ? "ĐÃ CẤP QUYỀN" : "CHƯA CẤP QUYỀN"}</Typography>
        </div>
      </div>

      <div className="my-4">
        <Typography className="font-bold mb-2">Địa chỉ</Typography>
        {addresses.length ? addresses.map((a, i) => (
          <Typography key={i} className="text-sm">{a.address} - {a.ward}, {a.district}, {a.province}</Typography>
        )) : <Typography className="text-gray-500 text-sm">Không có địa chỉ</Typography>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <Card>
          <CardBody>
            <Typography className="font-bold mb-2">Nông trại ({farms.length})</Typography>
            {farms.map(f => <Typography key={f.id}>{f.name}</Typography>)}
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Typography className="font-bold mb-2">Video ({videos.length})</Typography>
            {videos.map(v => <Typography key={v.id}>{v.title}</Typography>)}
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Typography className="font-bold mb-2">Bài viết ({posts.length})</Typography>
            {posts.map(p => <Typography key={p.id}>{p.title}</Typography>)}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
