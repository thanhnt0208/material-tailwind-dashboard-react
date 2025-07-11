import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card, CardHeader, CardBody, Typography, IconButton, Menu,
  MenuHandler, MenuList, MenuItem, Dialog, DialogHeader,
  DialogBody, DialogFooter, Input, Select, Option, Button, Spinner, Avatar
} from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export function Users() {
  const [users, setUsers] = useState([]);
  const [roles] = useState(["Customer", "Admin", "Farmer"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [editOpen, setEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({ fullName: '', phone: '', isActive: false });
  const [selectedRole, setSelectedRole] = useState("Farmer");
  const [addresses, setAddresses] = useState([]);

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

  const openEdit = async (user) => {
    setSelectedUser(user);
    setFormData({
      fullName: user.fullName,
      phone: user.phone || '',
      isActive: user.isActive || false,
    });
    try {
      const res = await axios.get(`https://api-ndolv2.nongdanonline.cc/user-addresses?userId=${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses(res.data || []);
      console.log("Địa chỉ:", res.data);
    } catch {
      setAddresses([]);
    }
    setEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!token || !selectedUser) return;
    try {
      await axios.put(`https://api-ndolv2.nongdanonline.cc/admin-users/${selectedUser.id}`,
        { fullName: formData.fullName, phone: formData.phone, isActive: formData.isActive },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      for (const addr of addresses) {
        await axios.put(`https://api-ndolv2.nongdanonline.cc/user-addresses/${addr.id}`,
          {
            addressName: addr.addressName,
            address: addr.address,
            ward: addr.ward,
            province: addr.province,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      alert("Cập nhật Thất Bại!");
      fetchUsers();
      setEditOpen(false);
    } catch {
      alert("Cập nhật thành công!");
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

  return (
    <div className="p-4">
      <Typography variant="h6" color="blue-gray" className="mb-4">Quản lý người dùng</Typography>
      {loading && <div className="flex justify-center py-4"><Spinner /></div>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100">
              {["Avatar", "Tên", "Email", "Phone", "Farm", "Post", "Video", "Trạng thái", "Thao tác"].map((head) => (
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
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.phone || "N/A"}</td>
                <td className="p-2">{user.farmsCount || 0}</td>
                <td className="p-2">{user.postsCount || 0}</td>
                <td className="p-2">{user.videosCount || 0}</td>
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

      <Dialog open={editOpen} handler={setEditOpen} size="sm">
        <DialogHeader>Chỉnh sửa người dùng</DialogHeader>
        <DialogBody className="space-y-3">
          <Input label="Full Name" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
          <Input label="Email (chỉ xem)" value={selectedUser?.email} disabled />
          <Input label="Phone" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
          <Select label="Trạng thái" value={formData.isActive ? "true" : "false"} onChange={(val) => setFormData({ ...formData, isActive: val === "true" })}>
            <Option value="true">Đã cấp quyền</Option>
            <Option value="false">Chưa cấp quyền</Option>
          </Select>

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

          {/* <Typography className="font-bold">Địa chỉ</Typography>
          {addresses.map((addr, idx) => (
            <div key={addr.id} className="space-y-1">
              <Input label="Tên địa chỉ" value={addr.addressName} onChange={e => {
                const update = [...addresses];
                update[idx].addressName = e.target.value;
                setAddresses(update);
              }} />
              <Input label="Địa chỉ" value={addr.address} onChange={e => {
                const update = [...addresses];
                update[idx].address = e.target.value;
                setAddresses(update);
              }} />
              <Input label="Phường/Xã" value={addr.ward} onChange={e => {
                const update = [...addresses];
                update[idx].ward = e.target.value;
                setAddresses(update);
              }} />
              <Input label="Tỉnh/TP" value={addr.province} onChange={e => {
                const update = [...addresses];
                update[idx].province = e.target.value;
                setAddresses(update);
              }} />
            </div>
          ))} */}
        </DialogBody>
        <DialogFooter>
          <Button variant="text" onClick={() => setEditOpen(false)}>Huỷ</Button>
          <Button variant="gradient" onClick={handleUpdate}>Lưu</Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default Users;
