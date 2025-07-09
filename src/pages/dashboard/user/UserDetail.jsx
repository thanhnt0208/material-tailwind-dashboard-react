import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardBody, Typography, Spinner } from "@material-tailwind/react";

export default function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Không tìm thấy access token!");
      setLoading(false);
      return;
    }

    axios.get(`https://api-ndolv2.nongdanonline.vn/admin-users/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setUser(res.data))
    .catch(() => setError("Không thể tải chi tiết người dùng."))
    .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <Spinner className="h-12 w-12" color="blue" />
    </div>
  );

  if (error) return (
    <Typography color="red" className="text-center mt-8">{error}</Typography>
  );

  if (!user) return <Typography className="text-center mt-8">Không có dữ liệu người dùng.</Typography>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <Card>
        <CardHeader floated={false} className="h-80">
          {user.avatar ? (
            <img
              src={`https://api-ndolv2.nongdanonline.vn${user.avatar}`}
              alt={user.fullName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gray-300 flex items-center justify-center text-gray-500">
              No Avatar
            </div>
          )}
        </CardHeader>
        <CardBody>
          <Typography variant="h4" color="blue-gray" className="mb-2">{user.fullName}</Typography>
          <Typography variant="small">Email: {user.email}</Typography>
          <Typography variant="small">Phone: {user.phone || "N/A"}</Typography>
          <Typography variant="small">Role: {Array.isArray(user.role) ? user.role.join(", ") : user.role}</Typography>
          <Typography variant="small">Active: {user.isActive ? "Yes" : "No"}</Typography>
          <Typography variant="small">Note: {user.note || "N/A"}</Typography>
          <Typography variant="small">Created At: {new Date(user.createdAt).toLocaleString()}</Typography>
          <Typography variant="small">Last Login: {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "N/A"}</Typography>
        </CardBody>
      </Card>
    </div>
  );
}
