import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card, CardHeader, CardBody, Typography, Spinner, Collapse,
} from "@material-tailwind/react";
import { useParams } from "react-router-dom";


export default function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [farms, setFarms] = useState([]);
  const [videos, setVideos] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFarms, setOpenFarms] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const userRes = await axios.get(`https://api-ndolv2.nongdanonline.cc/admin-users/${id}`, config);
        setUser(userRes.data);

        

        const [farmsRes, videosRes, postsRes] = await Promise.all([
          axios.get(`https://api-ndolv2.nongdanonline.cc/adminfarms`, config),
          axios.get(`https://api-ndolv2.nongdanonline.cc/admin-video-farm`, config),
          axios.get(`https://api-ndolv2.nongdanonline.cc/admin-post-feed`, config),
        ]);
        console.log("USER:", userRes.data);
        console.log("FARMS:", farmsRes.data?.data);

        setFarms(farmsRes.data?.data || []);
        setVideos(videosRes.data?.data || []);
        setPosts(postsRes.data?.data || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const countVideosByFarm = (farmId) => {
    return videos.filter((v) => v.farmId?.id === farmId).length;
  };

  const userFarms = farms.filter(f => f.ownerId === user?.id);

  const userPosts = posts.filter(p => p.authorId === user?.id);

  const userVideos = videos.filter(v => v.uploadedBy?.id === user?.id);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Spinner className="h-12 w-12" /></div>;
  }

  if (!user) {
    return <Typography color="red">Không tìm thấy user.</Typography>;
  }

  return (
    <div className="p-8 space-y-8">
      {/* Thông tin user */}
      <Card>
        <CardHeader>
          <Typography variant="h5">Thông tin User</Typography>
        </CardHeader>
        <CardBody>
          <img src={`https://api-ndolv2.nongdanonline.cc${user.avatar}`} alt="avatar" className="w-32 h-32 rounded-full" />
          <Typography>ID: {user._id}</Typography>
          <Typography>Name: {user.fullName}</Typography>
          <Typography>Email: {user.email}</Typography>
          <Typography>Phone: {user.phone}</Typography>
          <Typography>Role: {user.role}</Typography>
          <Typography>Status: {user.status}</Typography>
          <Typography>CreatedAt: {user.createdAt}</Typography>
          <Typography>UpdatedAt: {user.updatedAt}</Typography>

          <div className="mt-4">
            <Typography color="blue"><strong>Tổng số Farm:</strong> {userFarms.length}</Typography>
            <Typography color="blue"><strong>Tổng số Post:</strong> {userPosts.length}</Typography>
            <Typography color="blue"><strong>Tổng số Video:</strong> {userVideos.length}</Typography>
          </div>
        </CardBody>
      </Card>

      {/* Thông tin Farms của user */}
      <Card>
        <div
          onClick={() => setOpenFarms(!openFarms)}
          className="cursor-pointer flex justify-between items-center px-4 py-2 bg-gray-100 rounded-t"
        >
          <Typography variant="h5">
            Danh sách Farms ({userFarms.length})
          </Typography>
          <Typography variant="h5">{openFarms ? "▲" : "▼"}</Typography>
        </div>

        <Collapse open={openFarms}>
          <div className="overflow-hidden transition-all duration-300">
            <CardBody>
              {userFarms.length === 0 ? (
                <Typography>Chưa có Farm nào.</Typography>
              ) : userFarms.map((farm) => (
                <div key={farm._id} className="border p-4 mb-4 rounded shadow">
                  <Typography>ID: {farm._id}</Typography>
                  <Typography>Name: {farm.name}</Typography>
                  <Typography>Status: {farm.status}</Typography>
                  <Typography>Diện tích: {farm.cultivatedArea}</Typography>
                  <Typography>Address: {farm.province} {farm.district} {farm.street}</Typography>
                  <Typography>CreatedAt: {farm.createdAt}</Typography>
                  {farm.ownerInfo && (
                    <div className="mt-2 text-sm text-gray-700">
                      <Typography><strong>Chủ farm:</strong> {farm.ownerInfo.name}</Typography>
                      <Typography><strong>SĐT:</strong> {farm.ownerInfo.phone}</Typography>
                      <Typography><strong>Email:</strong> {farm.ownerInfo.email}</Typography>
                    </div>
                  )}
                  <Typography><strong>Số video liên quan:</strong> {countVideosByFarm(farm._id)}</Typography>
                </div>
              ))}
            </CardBody>
          </div>
        </Collapse>
      </Card>

    </div>
  );
}
