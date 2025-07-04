import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card, CardHeader, CardBody, CardFooter,
  Typography, Button, Tooltip, Dialog, DialogHeader,
  DialogBody, DialogFooter, Input, Select, Option
} from "@material-tailwind/react";
import { Link } from "react-router-dom";

export function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  
  const [editOpen, setEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', role: 'customer' });
  const [roles, setRoles] = useState([]);

  const getAccessToken = () => localStorage.getItem("accessToken");

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setError("Không tìm thấy access token!");
      setLoading(false);
      return;
    }
    axios.get("https://api-ndolv2.nongdanonline.vn/admin-users", {
      headers: { Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NjU0YTMxNjRmMTRjZWVlN2JlNTRjYSIsInJvbGUiOlsiQ3VzdG9tZXIiLCJBZG1pbiJdLCJpYXQiOjE3NTE2MzQzMDUsImV4cCI6MTc1MTg5MzUwNX0.qfl2smCZ35xZ49gwqgx8NwlkolEY2NV9hohMmG0M8do` }
    })
    .then(res => setUsers(Array.isArray(res.data) ? res.data : []))
    .catch(() => setError("Lỗi khi tải danh sách người dùng."))
    .finally(() => setLoading(false));

    axios.get("https://api-ndolv2.nongdanonline.vn/admin-users/roles", {
      headers: { Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NjU0YTMxNjRmMTRjZWVlN2JlNTRjYSIsInJvbGUiOlsiQ3VzdG9tZXIiLCJBZG1pbiJdLCJpYXQiOjE3NTE2MzQzMDUsImV4cCI6MTc1MTg5MzUwNX0.qfl2smCZ35xZ49gwqgx8NwlkolEY2NV9hohMmG0M8do` }
    })
    .then(res => setRoles(Array.isArray(res.data) ? res.data : []))
    .catch(() => setRoles(["customer", "admin", "farmer"]));
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
    const token = getAccessToken();
    if (!token || !selectedUser) return;

    axios.put(`https://api-ndolv2.nongdanonline.vn/admin-users/${selectedUser.id}`, formData, {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NjU0YTMxNjRmMTRjZWVlN2JlNTRjYSIsInJvbGUiOlsiQ3VzdG9tZXIiLCJBZG1pbiJdLCJpYXQiOjE3NTE2MzQzMDUsImV4cCI6MTc1MTg5MzUwNX0.qfl2smCZ35xZ49gwqgx8NwlkolEY2NV9hohMmG0M8do`,
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

  const handleDelete = (userId) => {
    const token = getAccessToken();
    if (!token) return;
    if (!window.confirm("Bạn có chắc muốn xoá người dùng này?")) return;

    axios.delete(`https://api-ndolv2.nongdanonline.vn/admin-users/${userId}`, {
      headers: { Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NjU0YTMxNjRmMTRjZWVlN2JlNTRjYSIsInJvbGUiOlsiQ3VzdG9tZXIiLCJBZG1pbiJdLCJpYXQiOjE3NTE2MzQzMDUsImV4cCI6MTc1MTg5MzUwNX0.qfl2smCZ35xZ49gwqgx8NwlkolEY2NV9hohMmG0M8do` },
    })
    .then(() => {
      alert("Xoá người dùng thành công!");
      setUsers(users.filter(user => user.id !== userId));
    })
    .catch(() => alert("Xoá thất bại!"));
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
              {user.avatar && <img src={user.avatar} alt={user.fullName} className="h-full w-full object-cover" />}
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
              <Button variant="outlined" size="sm" onClick={() => openEdit(user)}>Edit</Button>
              <Button variant="outlined" color="red" size="sm" onClick={() => handleDelete(user.id)}>Delete</Button>
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
            <Select label="Role" value={formData.role} onChange={val => setFormData({ ...formData, role: val })}>
              {roles.map(role => <Option key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</Option>)}
            </Select>
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
