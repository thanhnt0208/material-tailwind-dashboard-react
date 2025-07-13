import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography, Input, Select, Option, Button, Spinner, Avatar
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [searchText, setSearchText] = useState("");

  const roles = ["Customer", "Admin", "Farmer"];
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (filterRole) params.role = filterRole;
      if (filterStatus) params.isActive = filterStatus === "Active";
      if (searchText) params.search = searchText;

      const res = await axios.get("https://api-ndolv2.nongdanonline.cc/admin-users", {
        headers: { Authorization: `Bearer ${token}` }, params
      });
      let usersData = Array.isArray(res.data.data) ? res.data.data : [];
      setTotalPages(res.data.totalPages || 1);

      // Lấy thêm counts posts, farms, videos
      const [farmsRes, videosRes] = await Promise.all([
        axios.get("https://api-ndolv2.nongdanonline.cc/adminfarms", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("https://api-ndolv2.nongdanonline.cc/admin-video-farm", { headers: { Authorization: `Bearer ${token}` } })
      ]);
      const farms = farmsRes.data?.data || [];
      const videos = videosRes.data?.data || [];

      const countsObj = {};
      await Promise.all(usersData.map(async (user) => {
        const userId = user.id;
        const farmsCount = farms.filter(f => f.ownerId === userId).length;
        const videosCount = videos.filter(v => v.uploadedBy?.id === userId).length;

        let postsCount = 0;
        try {
          const postsRes = await axios.get(`https://api-ndolv2.nongdanonline.cc/admin-post-feed/user/${userId}`,
            { headers: { Authorization: `Bearer ${token}` } });
          postsCount = Array.isArray(postsRes.data?.data) ? postsRes.data.data.length : 0;
        } catch { }
        countsObj[userId] = { farms: farmsCount, videos: videosCount, posts: postsCount };
      }));
      setCounts(countsObj);

      // Nếu có searchText: sort để user trùng khớp lên đầu
      if (searchText) {
        usersData.sort((a, b) => {
          const search = searchText.toLowerCase();
          const aMatch = [a.fullName, a.email, a.phone].some(f => f?.toLowerCase().includes(search));
          const bMatch = [b.fullName, b.email, b.phone].some(f => f?.toLowerCase().includes(search));
          return bMatch - aMatch;
        });
      }
      setUsers(usersData);
    } catch (err) {
      console.error("Lỗi:", err);
      setError("Lỗi khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setError("Không tìm thấy token!");
      setLoading(false);
      return;
    }
    fetchUsers();
  }, [page, filterRole, filterStatus]);

  const handleSearch = () => {
    setPage(1);
    fetchUsers();
  };

  const handleView = (user) => navigate(`/dashboard/users/${user.id}`);

  return (
    <div className="p-4">
      <Typography variant="h6" color="blue-gray" className="mb-4">Quản lý người dùng</Typography>
      <div className="flex flex-wrap gap-2 mb-4">
        <Input label="Tìm kiếm theo tên, phone, email" value={searchText} onChange={e => setSearchText(e.target.value)} />
        <Select label="Lọc theo role" value={filterRole} onChange={setFilterRole}>
          <Option value="">Tất cả</Option>
          {roles.map(r => <Option key={r} value={r}>{r}</Option>)}
        </Select>
        <Select label="Trạng thái" value={filterStatus} onChange={setFilterStatus}>
          <Option value="">Tất cả</Option>
          <Option>Active</Option>
          <Option>Inactive</Option>
        </Select>
        <Button onClick={handleSearch}>Tìm kiếm</Button>
      </div>

      {loading && <div className="flex justify-center py-4"><Spinner /></div>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100">
              {["Avatar", "Tên", "Email", "Phone", "Role", "Posts", "Farms", "Videos", "Trạng thái"].map(head => (
                <th key={head} className="p-2 text-left text-xs font-semibold">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-t hover:bg-blue-50 cursor-pointer"
                  onClick={() => handleView(user)}>
                <td className="p-2"><Avatar src={user.avatar ? `https://api-ndolv2.nongdanonline.cc${user.avatar}` : ""} size="sm" /></td>
                <td className="p-2">{user.fullName}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.phone || "N/A"}</td>
                <td className="p-2 text-xs">{Array.isArray(user.role) ? user.role.join(", ") : user.role}</td>
                <td className="p-2">{counts[user.id]?.posts || 0}</td>
                <td className="p-2">{counts[user.id]?.farms || 0}</td>
                <td className="p-2">{counts[user.id]?.videos || 0}</td>
                <td className="p-2">
                  {user.isActive ? (
                    <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded">Active</span>
                  ) : (
                    <span className="bg-gray-500 text-white text-xs px-2 py-0.5 rounded">Inactive</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <Button size="sm" variant="outlined" disabled={page <= 1} onClick={() => setPage(prev => prev - 1)}>Trang trước</Button>
        <span>Trang {page} / {totalPages}</span>
        <Button size="sm" variant="outlined" disabled={page >= totalPages} onClick={() => setPage(prev => prev + 1)}>Trang sau</Button>
      </div>
      {/* Dialog chỉnh sửa */}
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

