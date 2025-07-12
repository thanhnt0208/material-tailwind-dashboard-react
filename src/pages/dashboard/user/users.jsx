import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography, IconButton, Menu,
  MenuHandler, MenuList, MenuItem, Dialog,
  DialogHeader, DialogBody, DialogFooter, Input,
  Select, Option, Button, Spinner, Avatar
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
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    isActive: true,
    address: ""
  });
  const [selectedRole, setSelectedRole] = useState("Farmer");
  const [counts, setCounts] = useState({});

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://api-ndolv2.nongdanonline.cc/admin-users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const usersData = Array.isArray(res.data) ? res.data : [];
      setUsers(usersData);

      // Lấy farms và videos trước
      const farmsRes = await axios.get("https://api-ndolv2.nongdanonline.cc/adminfarms", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const videosRes = await axios.get("https://api-ndolv2.nongdanonline.cc/admin-video-farm", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const countsObj = {};
      for (const user of usersData) {
        const userId = user.id;
        const farmsCount = farmsRes.data.filter(f => f.ownerId === userId).length;
        const videosCount = videosRes.data.filter(v => v.uploadedBy?.id === userId).length;

        let postsCount = 0;
        try {
          const postsRes = await axios.get(`https://api-ndolv2.nongdanonline.cc/admin-post-feed/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log("Posts response for user", userId, postsRes.data);
          if (Array.isArray(postsRes.data)) {
            postsCount = postsRes.data.length;
          } else if (postsRes.data?.data && Array.isArray(postsRes.data.data)) {
            postsCount = postsRes.data.data.length;
          } else {
            postsCount = 0;
          }
        } catch (error) {
          console.error("Lỗi lấy posts cho user", userId, error);
          postsCount = 0;
        }

        countsObj[userId] = { farms: farmsCount, videos: videosCount, posts: postsCount };
      }

      setCounts(countsObj);
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
      phone: user.phone || "",
      isActive: user.isActive,
      address: user.addresses?.[0]?.address || ""
    });
    setEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!token || !selectedUser) return;
    try {
      await axios.put(`https://api-ndolv2.nongdanonline.cc/admin-users/${selectedUser.id}`,
        {
          fullName: formData.fullName,
          phone: formData.phone,
          isActive: formData.isActive
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update địa chỉ (nếu có)
      if (selectedUser.addresses?.[0]?.id) {
        await axios.put(`https://api-ndolv2.nongdanonline.cc/user-addresses/${selectedUser.addresses[0].id}`,
          { address: formData.address },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
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
      await axios.delete(`https://api-ndolv2.nongdanonline.cc/admin-users/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } });
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
              {["Avatar", "Tên", "Email", "Phone", "Posts", "Farms", "Videos", "Trạng thái", "Thao tác"].map(head => (
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
                <td className="p-2">{counts[user.id]?.posts || 0}</td>
                <td className="p-2">{counts[user.id]?.farms || 0}</td>
                <td className="p-2">{counts[user.id]?.videos || 0}</td>
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

      <Dialog open={editOpen} handler={setEditOpen} size="sm">
        <DialogHeader>Chỉnh sửa người dùng</DialogHeader>
        <DialogBody className="space-y-3">
          <Input label="Full Name" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
          <Input label="Email" value={formData.email} disabled />
          <Input label="Phone" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
          <Select label="Trạng thái" value={formData.isActive ? "Đã cấp quyền" : "Chưa cấp quyền"}
            onChange={val => setFormData({ ...formData, isActive: val === "Đã cấp quyền" })}>
            <Option>Đã cấp quyền</Option>
            <Option>Chưa cấp quyền</Option>
          </Select>
          <Input label="Địa chỉ" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />

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
    </div>
  );
}

export default Users;
