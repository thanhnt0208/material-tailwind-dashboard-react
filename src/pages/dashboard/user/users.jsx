import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card, CardHeader, CardBody, Typography, IconButton, Menu,
  MenuHandler, MenuList, MenuItem, Dialog, DialogHeader,
  DialogBody, DialogFooter, Input, Select, Option, Button, Spinner, Avatar
} from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import FarmForm from "./FarmForm";
import { useNavigate } from "react-router-dom";
export function Users() {
  const [users, setUsers] = useState([]);
  const [roles] = useState(["Customer", "Admin", "Farmer"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [editOpen, setEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '' });
  const [selectedRole, setSelectedRole] = useState("Farmer");

  const [viewOpen, setViewOpen] = useState(false);
  const [viewUser, setViewUser] = useState(null);
  const [addresses, setAddresses] = useState([]);

  const [openFarmForm, setOpenFarmForm] = useState(false);
  const [farmFormData, setFarmFormData] = useState({ ownerId: null });

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://api-ndolv2.nongdanonline.cc/admin-users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(Array.isArray(res.data) ? res.data : []);
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
      await axios.put(`https://api-ndolv2.nongdanonline.cc/admin-users/${selectedUser.id}`, formData, {
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
        `https://api-ndolv2.nongdanonline.cc/admin-users/${selectedUser.id}/add-role`,
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
        `https://api-ndolv2.nongdanonline.cc/admin-users/${selectedUser.id}/remove-roles`,
        { roles: [role] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Xoá role thành công!");
      fetchUsers();
    } catch {
      alert("Không thể xoá role!");
    }
  };

const handleView = (user) => {
  navigate(`/dashboard/users/${user.id}`);
};

  const handleDelete = async (userId) => {
    if (!window.confirm("Bạn chắc muốn xoá?")) return;
    try {
      await axios.delete(
        `https://api-ndolv2.nongdanonline.cc/admin-users/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Đã xoá người dùng!");
      fetchUsers();
    } catch {
      alert("Xoá thất bại!");
    }
  };

  const handleCreateFarm = async (farmData) => {
    try {
      await axios.post("https://api-ndolv2.nongdanonline.cc/farms", farmData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Tạo nông trại thành công!");
      setOpenFarmForm(false);
    } catch {
      alert("Tạo nông trại thất bại!");
    }
  };

  return (
    <div className="p-4">
      <Typography variant="h6" color="blue-gray" className="mb-4">Quản lý người dùng</Typography>
      {loading && <div className="flex justify-center py-4"><Spinner /></div>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100">
              {["Avatar", "Tên", "Email", "Phone", "Roles", "Trạng thái", "Thao tác"].map((head) => (
                <th key={head} className="p-2 text-left text-xs font-semibold">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-t">
                <td className="p-2">
                  <Avatar src={user.avatar ? `https://api-ndolv2.nongdanonline.cc${user.avatar}` : ""} size="sm" />
                </td>
                <td className="p-2">{user.fullName}</td>
                <td className="p-2">{user.email.length > 25 ? user.email.slice(0, 20) + "..." : user.email}</td>
                <td className="p-2">{user.phone || "N/A"}</td>
                <td className="p-2 text-xs">{Array.isArray(user.role) ? user.role.join(", ") : user.role}</td>
                <td className="p-2">
                  {user.isActive ? (
                    <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded">ĐÃ CẤP QUYỀN</span>
                  ) : (
                    <span className="bg-gray-500 text-white text-xs px-2 py-0.5 rounded">CHƯA CẤP QUYỀN</span>
                  )}
                </td>
                <td className="p-2">
                  <Menu placement="left-start">
                    <MenuHandler>
                      <IconButton variant="text"><EllipsisVerticalIcon className="h-5 w-5" /></IconButton>
                    </MenuHandler>
                    <MenuList>
                      <MenuItem onClick={() => handleView(user)}>Xem</MenuItem>
                      <MenuItem onClick={() => openEdit(user)}>Sửa</MenuItem>
                      <MenuItem onClick={() => handleDelete(user.id)} className="text-red-500">Xoá</MenuItem>
                    </MenuList>
                  </Menu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Dialog SỬA */}
      <Dialog open={editOpen} handler={setEditOpen} size="sm">
        <DialogHeader>Chỉnh sửa người dùng</DialogHeader>
        <DialogBody className="space-y-3">
          <Input label="Full Name" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
          <Input label="Email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
          <Input label="Phone" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
          <Typography className="font-bold">Quản lý role</Typography>
          <Select label="Thêm role" value={selectedRole} onChange={setSelectedRole}>
            {roles.map(role => <Option key={role} value={role}>{role}</Option>)}
          </Select>
          <Button size="sm" variant="outlined" onClick={handleAddRole}>+ Thêm Role</Button>
          <div className="flex flex-wrap gap-2 mt-2">
            {(Array.isArray(selectedUser?.role) ? selectedUser.role : [selectedUser?.role]).map(role => (
              <span key={`${selectedUser?.id}-${role}`} className="flex items-center bg-blue-gray-100 rounded-full px-2 py-1 text-xs">
                {role}
                <button className="ml-1 text-red-500" onClick={() => handleRemoveRole(role)}>×</button>
              </span>
            ))}
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" onClick={() => setEditOpen(false)}>Huỷ</Button>
          <Button variant="gradient" onClick={handleUpdate}>Lưu</Button>
        </DialogFooter>
      </Dialog>

      {/* Dialog XEM */}
      <Dialog open={viewOpen} handler={setViewOpen} size="sm">
        <DialogHeader>Chi tiết người dùng</DialogHeader>
        <DialogBody className="space-y-2">
          {viewUser ? (
            <div className="flex flex-col items-center text-center space-y-2">
              <Avatar src={viewUser.avatar ? `https://api-ndolv2.nongdanonline.cc${viewUser.avatar}` : ""} size="xl" />
              <Typography variant="h6">{viewUser.fullName}</Typography>
              <Typography variant="small">ID: {viewUser.id}</Typography>
              <Typography>Email: {viewUser.email}</Typography>
              <Typography>Phone: {viewUser.phone || "N/A"}</Typography>
              <Typography>Roles: {Array.isArray(viewUser.role) ? viewUser.role.join(", ") : viewUser.role}</Typography>
              <Typography>
                Trạng thái: {viewUser.isActive ? (
                  <span className="text-green-600 font-semibold">ĐÃ CẤP QUYỀN</span>
                ) : (
                  <span className="text-gray-500 font-semibold">CHƯA CẤP QUYỀN</span>
                )}
              </Typography>
              <Typography className="font-bold">Địa chỉ:</Typography>
              {addresses.length ? addresses.map((addr, i) => (
                <Typography key={`${viewUser.id}-addr-${i}`} className="text-sm">
                  {addr.address} - {addr.ward}, {addr.district}, {addr.province}
                </Typography>
              )) : <Typography className="text-gray-400 text-sm">Không có địa chỉ</Typography>}
              <Button color="green" size="sm" className="mt-2" onClick={() => {
                setFarmFormData({ ownerId: viewUser.id });
                setOpenFarmForm(true);
              }}>
                Thêm nông trại cho người dùng này
              </Button>
            </div>
          ) : <Typography>Đang tải...</Typography>}
        </DialogBody>
        <DialogFooter>
          <Button variant="gradient" onClick={() => setViewOpen(false)}>Đóng</Button>
        </DialogFooter>
      </Dialog>

      <FarmForm
        open={openFarmForm}
        onClose={() => setOpenFarmForm(false)}
        initialData={farmFormData}
        onSubmit={handleCreateFarm}
      />
    </div>
  );
}

export default Users;
