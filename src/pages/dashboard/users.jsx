import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card, CardHeader, CardBody, CardFooter,
  Typography, Button, Tooltip, Dialog, DialogHeader,
  DialogBody, DialogFooter, Input
} from "@material-tailwind/react";
import { Link } from "react-router-dom";

export function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editOpen, setEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', role: '' });

  useEffect(() => {
    const token = localStorage.getItem("accessToken") ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NjU0YTMxNjRmMTRjZWVlN2JlNTRjYSIsInJvbGUiOlsiQ3VzdG9tZXIiLCJBZG1pbiJdLCJpYXQiOjE3NTE2MjQwMTYsImV4cCI6MTc1MTg4MzIxNn0.ID50CEtfWiVEMZ2p3_vwARX5FqC4QLMflLbZkFBbvJw";

    if (!token) {
      setError("Không tìm thấy access token!");
      setLoading(false);
      return;
    }

    axios.get("https://api-ndolv2.nongdanonline.vn/admin-users", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setUsers(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError("Lỗi khi tải danh sách người dùng."))
      .finally(() => setLoading(false));
  }, []);

  const openEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone || '',
      role: Array.isArray(user.role) ? user.role[0] : user.role,
    });
    setEditOpen(true);
  };

  const handleUpdate = () => {
    const token = localStorage.getItem("accessToken") ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NjU0YTMxNjRmMTRjZWVlN2JlNTRjYSIsInJvbGUiOlsiQ3VzdG9tZXIiLCJBZG1pbiJdLCJpYXQiOjE3NTE2MjQwMTYsImV4cCI6MTc1MTg4MzIxNn0.ID50CEtfWiVEMZ2p3_vwARX5FqC4QLMflLbZkFBbvJw";

    if (!token || !selectedUser) return;

    axios.put(`https://api-ndolv2.nongdanonline.vn/admin-users/${selectedUser.id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then(() => {
        alert("Cập nhật thành công!");
        setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...formData } : u));
        setEditOpen(false);
      })
      .catch(() => alert("Cập nhật thất bại!"));
  };

  return (
    <div className="px-4 pb-4">
      <Typography variant="h6" color="blue-gray" className="mb-2">
        Users Management
      </Typography>
      {loading && <p className="text-blue-500">Đang tải...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="mt-6 grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-4">
        {users.map((user) => (
          <Card key={user.id} color="transparent" shadow={false}>
            <CardHeader floated={false} color="gray" className="mx-0 mt-0 mb-4 h-64 xl:h-40">
              <img
                src={user.avatar}
                alt={user.fullName}
                className="h-full w-full object-cover"
              />
            </CardHeader>
            <CardBody className="py-0 px-1">
              <Typography variant="h5" color="blue-gray" className="mb-1">
                {user.fullName}
              </Typography>
              <Typography variant="small">Email: {user.email}</Typography>
              <Typography variant="small">Phone: {user.phone || "N/A"}</Typography>
              <Typography variant="small">Role: {Array.isArray(user.role) ? user.role.join(", ") : user.role}</Typography>
              <Typography variant="small">Active: {user.isActive ? "Yes" : "No"}</Typography>
            </CardBody>
            <CardFooter className="mt-6 flex items-center justify-between py-0 px-1">
              <Button variant="outlined" size="sm" onClick={() => openEdit(user)}>
                Edit
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={editOpen} handler={setEditOpen} size="sm">
        <DialogHeader>Chỉnh sửa người dùng</DialogHeader>
        <DialogBody>
          <div className="flex flex-col gap-4">
            <Input label="Full Name" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
            <Input label="Email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
            <Input label="Phone" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
            <Input label="Role" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" onClick={() => setEditOpen(false)}>Hủy</Button>
          <Button variant="gradient" color="green" onClick={handleUpdate}>Lưu</Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default Users;
