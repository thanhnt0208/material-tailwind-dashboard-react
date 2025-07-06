import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card, CardHeader, CardBody, CardFooter,
  Typography, Button, Dialog, DialogHeader,
  DialogBody, DialogFooter, Input, Select, Option, Spinner
} from "@material-tailwind/react";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', role: '' });
  const [viewOpen, setViewOpen] = useState(false);
  const [viewUser, setViewUser] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState({});

  const token = localStorage.getItem("token");

  useEffect(() => {
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
  }, [token]);

  useEffect(() => {
    if (!token) return;

    axios.get("https://api-ndolv2.nongdanonline.vn/admin-users/roles", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setRoles(Array.isArray(res.data) ? res.data : []))
      .catch(() => setRoles(["customer", "admin", "farmer", "staff"]));
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

  const handleView = (user) => {
    setViewUser(user);
    setViewOpen(true);
  };

  const handleUpdate = () => {
    if (!token || !selectedUser) return;

    axios.put(`https://api-ndolv2.nongdanonline.vn/admin-users/${selectedUser.id}`, formData, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    })
      .then(() => {
        alert("Cập nhật thành công!");
        setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...formData } : u));
        setEditOpen(false);
      })
      .catch(() => alert("Cập nhật thất bại!"));
  };

  const handleDelete = (userId) => {
    if (!token) return;
    if (!window.confirm("Bạn có chắc muốn xoá người dùng này?")) return;

    axios.delete(`https://api-ndolv2.nongdanonline.vn/admin-users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        alert("Xoá người dùng thành công!");
        setUsers(users.filter(user => user.id !== userId));
      })
      .catch(() => alert("Xoá thất bại!"));
  };

  const handleAddRole = (userId, role) => {
    if (!token) return;
    axios.patch(`https://api-ndolv2.nongdanonline.vn/admin-users/${userId}/add-role`, {
      role
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      setUsers(users.map(u => {
        if (u.id === userId && !u.role.includes(role)) {
          return { ...u, role: [...u.role, role] };
        }
        return u;
      }));
    })
    .catch(() => alert("Thêm vai trò thất bại"));
  };

  const handleRemoveRole = (userId, role) => {
    if (!token) return;
    axios.patch(`https://api-ndolv2.nongdanonline.vn/admin-users/${userId}/remove-role`, {
      role
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      setUsers(users.map(u => {
        if (u.id === userId) {
          return { ...u, role: u.role.filter(r => r !== role) };
        }
        return u;
      }));
    })
    .catch(() => alert("Xoá vai trò thất bại"));
  };

  return (
    <div className="px-4 pb-4">
      <Typography variant="h6" color="blue-gray" className="mb-2">Users Management</Typography>
      {loading && (
        <div className="flex justify-center py-4">
          <Spinner className="h-8 w-8" color="blue" />
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}

      <div className="mt-6 grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-4">
        {users.map((user) => (
          <div key={user.id} className="cursor-pointer">
            <Card color="transparent" shadow={false}>
              <CardHeader floated={false} color="gray" className="mx-0 mt-0 mb-4 h-64 xl:h-40">
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
              <CardBody className="py-0 px-1">
                <Typography variant="h5" color="blue-gray" className="mb-1">{user.fullName}</Typography>
                <Typography variant="small">Email: {user.email}</Typography>
                <Typography variant="small">Phone: {user.phone || "N/A"}</Typography>
                <Typography variant="small">Role: {Array.isArray(user.role) ? user.role.join(", ") : user.role}</Typography>
                <Typography variant="small">Active: {user.isActive ? "Yes" : "No"}</Typography>
              </CardBody>
              <CardFooter className="mt-6 flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <Button variant="outlined" size="sm" onClick={() => openEdit(user)}>Edit</Button>
                  <Button variant="outlined" color="red" size="sm" onClick={() => handleDelete(user.id)}>Delete</Button>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    label="Thêm Role"
                    value={selectedRoles[user.id] || ""}
                    onChange={(val) => setSelectedRoles(prev => ({ ...prev, [user.id]: val }))}
                  >
                    {roles.map(role => (
                      <Option key={role} value={role}>{role}</Option>
                    ))}
                  </Select>
                  <Button size="sm" onClick={() => handleAddRole(user.id, selectedRoles[user.id])}>+ ROLE</Button>
                </div>
                {Array.isArray(user.role) && user.role.map(r => (
                  <div key={r} className="flex justify-between items-center">
                    <Typography variant="small" className="text-xs">{r}</Typography>
                    <Button size="sm" color="red" onClick={() => handleRemoveRole(user.id, r)}>- REMOVE</Button>
                  </div>
                ))}
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>

      {/* Dialog chỉnh sửa */}
      <Dialog open={editOpen} handler={setEditOpen} size="sm">
        <DialogHeader>Chỉnh sửa người dùng</DialogHeader>
        <DialogBody>
          <div className="flex flex-col gap-4">
            <Input label="Full Name" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
            <Input label="Email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
            <Input label="Phone" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
            <Select label="Role" value={formData.role} onChange={val => setFormData({ ...formData, role: val })}>
              {roles.map(role => (
                <Option key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</Option>
              ))}
            </Select>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" onClick={() => setEditOpen(false)}>Hủy</Button>
          <Button variant="gradient" color="green" onClick={handleUpdate}>Lưu</Button>
        </DialogFooter>
      </Dialog>

      {/* Dialog xem chi tiết */}
      <Dialog open={viewOpen} handler={setViewOpen} size="sm">
        <DialogHeader>Thông tin chi tiết</DialogHeader>
        <DialogBody>
          {viewUser && (
            <div className="space-y-2">
              <Typography variant="h6" className="font-bold">{viewUser.fullName}</Typography>
              <Typography>Email: {viewUser.email}</Typography>
              <Typography>Phone: {viewUser.phone || "N/A"}</Typography>
              <Typography>Roles: {Array.isArray(viewUser.role) ? viewUser.role.join(", ") : viewUser.role}</Typography>
              <Typography>Active: {viewUser.isActive ? "Yes" : "No"}</Typography>
              <Typography>ID: {viewUser.id}</Typography>
              <Typography variant="small">Created At: {new Date(viewUser.createdAt).toLocaleString()}</Typography>
              <Typography variant="small">Last Login: {viewUser.lastLogin ? new Date(viewUser.lastLogin).toLocaleString() : "N/A"}</Typography>
            </div>
          )}
        </DialogBody>
        <DialogFooter>
          <Button variant="gradient" onClick={() => setViewOpen(false)}>Đóng</Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
