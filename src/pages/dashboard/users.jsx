import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card, CardHeader, CardBody, CardFooter,
  Typography, Button, Dialog, DialogHeader,
  DialogBody, DialogFooter, Input, Select, Option, Spinner
} from "@material-tailwind/react";

export function Users() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editOpen, setEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', role: '' });

  const [viewOpen, setViewOpen] = useState(false);
  const [viewUser, setViewUser] = useState(null);
  const [addresses, setAddresses] = useState([]);

  const [selectedRole, setSelectedRole] = useState("farmer");

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://api-ndolv2.nongdanonline.vn/admin-users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError("Lỗi khi tải danh sách người dùng.");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
      if (!token) {
        setError("Không tìm thấy access token!");
        setLoading(false);
        return;
      }
      fetchUsers();
    }, [token]);

      useEffect(() => {
      setRoles(["Customer", "Admin", "Farmer"]); 
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

  const handleView = async (user) => {
    setViewUser(user);
    setViewOpen(true);
    try {
      const res = await axios.get("https://api-ndolv2.nongdanonline.vn/user-addresses", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const userAddresses = res.data.filter(addr => addr.userid === user.id);
      setAddresses(userAddresses);
    } catch (err) {
      setAddresses([]);
    }
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

  const handleAddRole = async (userId, role) => {
    try {
      await axios.patch(
        `https://api-ndolv2.nongdanonline.vn/admin-users/${userId}/add-role`,
        { role: role.charAt(0).toUpperCase() + role.slice(1) }, 
        { headers: { Authorization: `Bearer ${token}` } }
    );
      alert("Đã thêm role thành công!");
      fetchUsers();
    } catch (e) {
      alert("Không thể thêm role!");
    }
  };

  const handleRemoveRole = async (userId, role) => {
    try {
      await axios.patch(
        `https://api-ndolv2.nongdanonline.vn/admin-users/${userId}/remove-roles`,
        { roles: [role.charAt(0).toUpperCase() + role.slice(1)] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Đã xoá role thành công!");
      fetchUsers();
    } catch (e) {
      alert("Không thể xoá role!");
    }
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
              <CardFooter className="mt-4 flex flex-col gap-2 px-1">
                <div className="flex justify-between">
                  <Button variant="outlined" size="sm" onClick={() => handleView(user)}>View</Button>
                  <Button variant="outlined" size="sm" onClick={() => openEdit(user)}>Edit</Button>
                  <Button variant="outlined" color="red" size="sm" onClick={() => handleDelete(user.id)}>Delete</Button>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Select value={selectedRole} onChange={setSelectedRole} label="Chọn Role">
                    {roles.map(role => <Option key={role} value={role}>{role}</Option>)}
                  </Select>
                  <Button size="sm" onClick={() => handleAddRole(user.id, selectedRole)}>+</Button>
                  <Button size="sm" color="red" onClick={() => handleRemoveRole(user.id, selectedRole)}>-</Button>
                </div>
              </CardFooter>
            </Card>
          </div>
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

      <Dialog open={viewOpen} handler={setViewOpen} size="sm">
        <DialogHeader>Thông tin chi tiết</DialogHeader>
        <DialogBody>
          {viewUser ? (
            <div className="space-y-2">
              <Typography variant="h6" className="font-bold">{viewUser.fullName}</Typography>
              <Typography>Email: {viewUser.email}</Typography>
              <Typography>Phone: {viewUser.phone || "N/A"}</Typography>
              <Typography>Roles: {Array.isArray(viewUser.role) ? viewUser.role.join(", ") : viewUser.role}</Typography>
              <Typography>Active: {viewUser.isActive ? "Yes" : "No"}</Typography>
              <Typography>ID: {viewUser.id}</Typography>
              <Typography variant="small">Created At: {new Date(viewUser.createdAt).toLocaleString()}</Typography>
              <Typography variant="small">Last Login: {viewUser.lastLogin ? new Date(viewUser.lastLogin).toLocaleString() : "N/A"}</Typography>
              <Typography className="mt-2 font-bold">Addresses:</Typography>
              {addresses.length > 0 ? addresses.map((addr, i) => (
                <div key={i} className="text-sm text-gray-600">
                  {addr.address} - {addr.ward}, {addr.district}, {addr.province}
                </div>
              )) : <Typography className="text-gray-400 text-sm">Không có địa chỉ</Typography>}
            </div>
          ) : (
              <Typography className="text-gray-500 text-center">Đang tải dữ liệu...</Typography>
          )}
        </DialogBody>
        <DialogFooter>
          <Button variant="gradient" onClick={() => setViewOpen(false)}>Đóng</Button>
        </DialogFooter>
      </Dialog>
    </div>
  ) 
}

export default Users