import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card, CardBody, Typography, Avatar, Spinner, Button
} from "@material-tailwind/react";

export default function UserDetail() {
  const { id } = useParams(); // Lấy ID từ URL
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserAndFarms = async () => {
      try {
        const [userRes, farmsRes] = await Promise.all([
          axios.get(`https://api-ndolv2.nongdanonline.cc/admin-users/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("https://api-ndolv2.nongdanonline.cc/adminfarms", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setUser(userRes.data);
        const userFarms = farmsRes.data.filter(farm => farm.ownerId === id);
        setFarms(userFarms);

      } catch (err) {
        console.error(err);
        alert("Lỗi khi tải dữ liệu!");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUserAndFarms();
    } else {
      alert("Không tìm thấy token, vui lòng đăng nhập!");
      navigate("/login");
    }
  }, [id, token, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return <Typography className="text-center text-red-500">Không tìm thấy user!</Typography>;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Button onClick={() => navigate(-1)} variant="outlined" size="sm" className="mb-4">← Quay lại</Button>

      {/* Thông tin user */}
      <Card className="p-4 mb-6">
        <div className="flex items-center space-x-4">
          <Avatar
            size="xl"
            src={user.avatar ? `https://api-ndolv2.nongdanonline.cc${user.avatar}` : ""}
          />
          <div>
            <Typography variant="h5">{user.fullName}</Typography>
            <Typography>Email: {user.email}</Typography>
            <Typography>Phone: {user.phone || "N/A"}</Typography>
            <Typography>Roles: {Array.isArray(user.role) ? user.role.join(", ") : user.role}</Typography>
            <Typography>
              Trạng thái: {user.isActive ? (
                <span className="text-green-600 font-semibold">ĐÃ CẤP QUYỀN</span>
              ) : (
                <span className="text-gray-500 font-semibold">CHƯA CẤP QUYỀN</span>
              )}
            </Typography>
          </div>
        </div>
      </Card>

      {/* Danh sách farm */}
      <div>
        <Typography variant="h6" className="mb-2">Danh sách nông trại</Typography>
        {farms.length ? (
          farms.map((farm) => (
            <Card key={farm._id} className="mb-4 flex flex-col md:flex-row p-4 items-center">
              {farm.defaultImage?.imageUrl && (
                <img
                  src={`https://api-ndolv2.nongdanonline.cc${farm.defaultImage.imageUrl}`}
                  alt={farm.defaultImage.description || "Farm"}
                  className="w-32 h-32 object-cover rounded-md mb-2 md:mb-0 md:mr-4"
                />
              )}
              <CardBody>
                <Typography variant="small">Diện tích: {farm.cultivatedArea} m²</Typography>
                <Typography variant="small">Trạng thái: {farm.status}</Typography>
                {farm.coordinates && (
                  <Typography variant="small">
                    Toạ độ: {farm.coordinates.lat}, {farm.coordinates.lng}
                  </Typography>
                )}
              </CardBody>
            </Card>
          ))
        ) : (
          <Typography className="text-gray-400">Người dùng chưa có nông trại nào.</Typography>
        )}
      </div>

      {/* Bài post / video */}
      <div className="mt-6">
        <Typography variant="h6">Bài Post / Video</Typography>
        <Typography className="text-gray-400">Đang phát triển...</Typography>
      </div>
    </div>
  );
}
