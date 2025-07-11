import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card, CardHeader, CardBody, Typography, Spinner,
} from "@material-tailwind/react";
import { useParams } from "react-router-dom";

export default function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [farms, setFarms] = useState([]);
  const [videos, setVideos] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Load user
        const userRes = await axios.get(`https://api-ndolv2.nongdanonline.cc/admin-users/${id}`);
        setUser(userRes.data.data);

        // Load farms
        const farmsRes = await axios.get(`https://api-ndolv2.nongdanonline.cc/adminfarms?ownerId=${id}`);
        setFarms(farmsRes.data.data);

        // Load videos
        const videosRes = await axios.get(`https://api-ndolv2.nongdanonline.cc/adminvideos?ownerId=${id}`);
        setVideos(videosRes.data.data);

        // Load posts
        const postsRes = await axios.get(`https://api-ndolv2.nongdanonline.cc/adminposts?ownerId=${id}`);
        setPosts(postsRes.data.data);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

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
        </CardBody>
      </Card>

      {/* Thông tin Farms */}
      <Card>
        <CardHeader>
          <Typography variant="h5">Danh sách Farms</Typography>
        </CardHeader>
        <CardBody>
          {farms.length === 0 ? (
            <Typography>Chưa có Farm nào.</Typography>
          ) : farms.map((farm) => (
            <div key={farm._id} className="border p-4 mb-4 rounded shadow">
              <Typography>ID: {farm._id}</Typography>
              <Typography>Name: {farm.name}</Typography>
              <Typography>Status: {farm.status}</Typography>
              <Typography>Diện tích: {farm.cultivatedArea}</Typography>
              <Typography>Address: {farm.province} {farm.district} {farm.street}</Typography>
              <Typography>Coordinate: {farm.coordinates?.lat} - {farm.coordinates?.lng}</Typography>
              <Typography>CreatedAt: {farm.createdAt}</Typography>
              {farm.defaultImage && (
                <img
                  src={`https://api-ndolv2.nongdanonline.cc${farm.defaultImage.imageUrl}`}
                  alt="Farm"
                  className="w-64 rounded"
                />
              )}
            </div>
          ))}
        </CardBody>
      </Card>

      {/* Thông tin Videos */}
      <Card>
        <CardHeader>
          <Typography variant="h5">Danh sách Videos</Typography>
        </CardHeader>
        <CardBody>
          {videos.length === 0 ? (
            <Typography>Chưa có Video nào.</Typography>
          ) : videos.map((video) => (
            <div key={video._id} className="border p-4 mb-4 rounded shadow">
              <Typography>ID: {video._id}</Typography>
              <Typography>Title: {video.title}</Typography>
              <Typography>Description: {video.description}</Typography>
              <Typography>Status: {video.status}</Typography>
              <Typography>CreatedAt: {video.createdAt}</Typography>
              {video.thumbnail && (
                <img
                  src={`https://api-ndolv2.nongdanonline.cc${video.thumbnail}`}
                  alt="Thumbnail"
                  className="w-64 rounded"
                />
              )}
            </div>
          ))}
        </CardBody>
      </Card>

      {/* Thông tin Posts */}
      <Card>
        <CardHeader>
          <Typography variant="h5">Danh sách Posts</Typography>
        </CardHeader>
        <CardBody>
          {posts.length === 0 ? (
            <Typography>Chưa có Post nào.</Typography>
          ) : posts.map((post) => (
            <div key={post._id} className="border p-4 mb-4 rounded shadow">
              <Typography>ID: {post._id}</Typography>
              <Typography>Title: {post.title}</Typography>
              <Typography>Content: {post.content}</Typography>
              <Typography>Status: {post.status}</Typography>
              <Typography>CreatedAt: {post.createdAt}</Typography>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
}
