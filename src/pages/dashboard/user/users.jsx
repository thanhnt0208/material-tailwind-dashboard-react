import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card, CardHeader, CardBody, CardFooter,
  Typography, Button, Dialog, DialogHeader,
  DialogBody, DialogFooter, Input, Select, Option, Spinner
} from "@material-tailwind/react";
import FarmForm from "./FarmForm";

export function Users() {
  const [users, setUsers] = useState([]);
  const [roles] = useState(["Customer", "Admin", "Farmer"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editOpen, setEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '' });
  const [selectedRole, setSelectedRole] = useState("Farmer");

  const [viewOpen, setViewOpen] = useState(false);
  const [viewUser, setViewUser] = useState(null);
  const [addresses, setAddresses] = useState([]);

  const [openFarmForm, setOpenFarmForm] = useState(false);
  const [farmFormData, setFarmFormData] = useState(null);

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://api-ndolv2.nongdanonline.vn/admin-users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const activeUsers = (Array.isArray(res.data) ? res.data : []).filter(u => u.isActive);
      setUsers(activeUsers);
    } catch {
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

  const openEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone || ''
    });
    setEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!token || !selectedUser) return;
    try {
      await axios.put(`https://api-ndolv2.nongdanonline.vn/admin-users/${selectedUser.id}`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      alert("Cập nhật thành công!");
      fetchUsers();
      setEditOpen(false);
    } catch {
      alert("Cập nhật thất bại!");
    }
  };

  const handleAddRole = async () => {
    if (!selectedUser) return;
    try {
      await axios.patch(
        `https://api-ndolv2.nongdanonline.vn/admin-users/${selectedUser.id}/add-role`,
        { role: selectedRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Thêm role thành công!");
      fetchUsers();
    } catch {
      alert("Không thể thêm role!");
    }
  };

  const handleRemoveRole = async (role) => {
    if (!selectedUser) return;
    try {
      await axios.patch(
        `https://api-ndolv2.nongdanonline.vn/admin-users/${selectedUser.id}/remove-roles`,
        { roles: [role] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Xoá role thành công!");
      fetchUsers();
    } catch {
      alert("Không thể xoá role!");
    }
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
    } catch {
      setAddresses([]);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Bạn chắc muốn xoá?")) return;
    try {
      await axios.delete(
        `https://api-ndolv2.nongdanonline.vn/admin-users/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Đã xoá người dùng!");
      fetchUsers();
    } catch {
      alert("Xoá thất bại!");
    }
  };

  return (
    <div className="px-4 pb-4">
      <Typography variant="h6" color="blue-gray" className="mb-2">Quản lý người dùng</Typography>
      {loading && <div className="flex justify-center py-4"><Spinner /></div>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {users.map(user => (
          <Card key={user.id}>
            <CardHeader floated={false} color="gray" className="h-40">
              {user.avatar ? (
                <img src={`https://api-ndolv2.nongdanonline.vn${user.avatar}`} alt={user.fullName} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-gray-300 flex items-center justify-center">No Avatar</div>
              )}
            </CardHeader>
            <CardBody>
              <Typography variant="h6">{user.fullName}</Typography>
              <Typography variant="small">Email: {user.email}</Typography>
              <Typography variant="small">Phone: {user.phone || "N/A"}</Typography>
              <Typography variant="small">Roles: {Array.isArray(user.role) ? user.role.join(", ") : user.role}</Typography>
            </CardBody>
            <CardFooter className="flex flex-col gap-2">
              <div className="flex justify-between">
                <Button size="sm" variant="outlined" onClick={() => handleView(user)}>XEM</Button>
                <Button size="sm" variant="outlined" onClick={() => openEdit(user)}>SỬA</Button>
                <Button size="sm" color="red" variant="outlined" onClick={() => handleDelete(user.id)}>XOÁ</Button>
              </div>
              <div className="flex gap-2">
                <Select label="Chọn role" value={selectedRole} onChange={setSelectedRole}>
                  {roles.map(role => <Option key={role} value={role}>{role}</Option>)}
                </Select>
                <Button size="sm" onClick={() => { setSelectedUser(user); handleAddRole(); }}>+</Button>
                <Button size="sm" color="red" onClick={() => { setSelectedUser(user); handleRemoveRole(selectedRole); }}>-</Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Dialog Edit */}
      <Dialog open={editOpen} handler={setEditOpen} size="sm">
        <DialogHeader>Chỉnh sửa người dùng</DialogHeader>
        <DialogBody>
          <div className="flex flex-col gap-3">
            <Input label="Full Name" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
            <Input label="Email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
            <Input label="Phone" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" onClick={() => setEditOpen(false)}>Huỷ</Button>
          <Button variant="gradient" onClick={handleUpdate}>Lưu</Button>
        </DialogFooter>
      </Dialog>

      {/* Dialog View */}
      <Dialog open={viewOpen} handler={setViewOpen} size="sm">
        <DialogHeader>Chi tiết người dùng</DialogHeader>
        <DialogBody>
          {viewUser ? (
            <>
              <Typography variant="h6">{viewUser.fullName}</Typography>
              <Typography>Email: {viewUser.email}</Typography>
              <Typography>Phone: {viewUser.phone || "N/A"}</Typography>
              <Typography>Roles: {Array.isArray(viewUser.role) ? viewUser.role.join(", ") : viewUser.role}</Typography>
              <Typography>ID: {viewUser.id}</Typography>
              <Typography className="mt-2 font-bold">Addresses:</Typography>
              {addresses.length ? addresses.map((addr, i) => (
                <Typography key={`${viewUser.id}-addr-${i}`} className="text-sm">{addr.address} - {addr.ward}, {addr.district}, {addr.province}</Typography>
              )) : <Typography className="text-gray-400 text-sm">Không có địa chỉ</Typography>}
              <Button
                color="green"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setFarmFormData({ ownerId: viewUser.id });
                  setOpenFarmForm(true);
                }}
              >
                Thêm nông trại cho người dùng này
              </Button>
            </>
          ) : <Typography>Đang tải...</Typography>}
        </DialogBody>
        <DialogFooter>
          <Button variant="gradient" onClick={() => setViewOpen(false)}>Đóng</Button>
        </DialogFooter>
      </Dialog>

      {/* Farm Form */}
      <FarmForm
        open={openFarmForm}
        onClose={() => setOpenFarmForm(false)}
        initialData={farmFormData}
        onSubmit={async (data) => {
          try {
            const payload = { ...data, ownerId: farmFormData.ownerId };
            await axios.post("https://api-ndolv2.nongdanonline.vn/adminfarms", payload, {
              headers: { Authorization: `Bearer ${token}` },
            });
            alert("Tạo farm thành công!");
            setOpenFarmForm(false);
          } catch (err) {
            alert("Lỗi khi thêm farm: " + (err.response?.data?.message || err.message));
          }
        }}
      />
    </div>
  );
}

export default Users;
