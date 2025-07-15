import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography, IconButton, Menu, MenuHandler, MenuList, MenuItem,
  Dialog, DialogHeader, DialogBody, DialogFooter,
  Input, Select, Option, Button, Spinner, Avatar
} from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  // const [roles] = useState(["Customer", "Admin", "Farmer", "Staff" ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [counts, setCounts] = useState({});

  const [editOpen, setEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "", email: "", phone: "", isActive: true, address: ""
  });
  const [selectedRole, setSelectedRole] = useState("Farmer");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [searchText, setSearchText] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch users + counts
  const fetchUsers = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const params = { page, limit };
      if (filterRole) params.role = filterRole;
      if (filterStatus) params.isActive = filterStatus === "Active";

      const res = await axios.get("https://api-ndolv2.nongdanonline.cc/admin-users", {
        headers: { Authorization: `Bearer ${token}` }, params
      });
      const usersData = Array.isArray(res.data.data) ? res.data.data : [];
      setUsers(usersData);
      // Tự động lấy danh sách role duy nhất từ users
const uniqueRoles = Array.from(
  new Set(usersData.flatMap(user =>
    Array.isArray(user.role) ? user.role : [user.role]
  ))
);
setRoles(uniqueRoles);

      setTotalPages(res.data.totalPages || 1);

      // Gọi counts
      const [farmsRes, videosRes, postsRes] = await Promise.all([
        axios.get(`https://api-ndolv2.nongdanonline.cc/adminfarms?page=${page}&limit=10`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`https://api-ndolv2.nongdanonline.cc/admin-video-farm?page=${page}&limit=10`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("https://api-ndolv2.nongdanonline.cc/admin-post-feed?page=1&limit=1000", { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const farms = farmsRes.data?.data || [];
      const videos = videosRes.data?.data || [];
      const posts = postsRes.data?.data || [];

      const postCountsMap = {};
      posts.forEach(p => {
        const uid = p.userId || p.authorId;
        if (uid) postCountsMap[uid] = (postCountsMap[uid] || 0) + 1;
      });

      const countsObj = {};
      usersData.forEach(user => {
        countsObj[user.id] = {
          farms: farms.filter(f => f.ownerId === user.id).length,
          videos: videos.filter(v => v.uploadedBy?.id === user.id).length,
          posts: postCountsMap[user.id] || 0
        };
      });
      setCounts(countsObj);
    } catch (err) {
      console.error("Lỗi khi tải users:", err);
      setError("Lỗi khi tải danh sách người dùng.");
    } finally {
      setLoading(false);
    }
  };

  // handleSearch: tìm fullName, email, phone
  const handleSearch = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const paramsCommon = { page: 1, limit: 10 };
      if (filterRole) paramsCommon.role = filterRole;
      if (filterStatus) paramsCommon.isActive = filterStatus === "Active";

      const [byName, byEmail, byPhone] = await Promise.all([
        axios.get("https://api-ndolv2.nongdanonline.cc/admin-users", {
          headers: { Authorization: `Bearer ${token}` },
          params: { ...paramsCommon, fullName: searchText }
        }),
        axios.get("https://api-ndolv2.nongdanonline.cc/admin-users", {
          headers: { Authorization: `Bearer ${token}` },
          params: { ...paramsCommon, email: searchText }
        }),
        axios.get("https://api-ndolv2.nongdanonline.cc/admin-users", {
          headers: { Authorization: `Bearer ${token}` },
          params: { ...paramsCommon, phone: searchText }
        }),
      ]);

      const merged = [
        ...(byName.data.data || []),
        ...(byEmail.data.data || []),
        ...(byPhone.data.data || [])
      ];
      const unique = merged.filter(
        (v, i, a) => a.findIndex(t => t.id === v.id) === i
      );

      setUsers(unique);
      setTotalPages(1);
      setPage(1);
      setIsSearching(true);
    } catch (err) {
      console.error("Lỗi tìm kiếm:", err);
      setError("Lỗi khi tìm kiếm.");
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
    if (!isSearching) fetchUsers();
  }, [token, page, filterRole, filterStatus, isSearching]);

  // Edit user
  const openEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      fullName: user.fullName, email: user.email,
      phone: user.phone || "", isActive: user.isActive,
      addresses: user?.addresses || [""],
    });
    setEditOpen(true);
  };

const handleUpdate = async () => {
  if (!token || !selectedUser) return;
  try {
    // Update user
    await axios.put(
      `https://api-ndolv2.nongdanonline.cc/admin-users/${selectedUser.id}/active`,
      {
        fullName: formData.fullName,
        phone: formData.phone,
        isActive: formData.isActive,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Update ĐỊA CHỈ an toàn
    for (let i = 0; i < formData.addresses.length; i++) {
      const addr = formData.addresses[i];
      const existing = selectedUser.addresses?.[i];
      if (existing?.id) {
        // Có ID thì PUT
        await axios.put(
          `https://api-ndolv2.nongdanonline.cc/user-addresses/${existing.id}`,
          { address: addr },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Không có thì POST mới
        await axios.post(
          `https://api-ndolv2.nongdanonline.cc/user-addresses`,
          {
            userId: selectedUser.id,
            address: addr,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    }

    alert("Cập nhật thành công!");
    fetchUsers();
    setEditOpen(false);
  } catch (err) {
    console.error("Update LỖI:", err);
    alert("Cập nhật thất bại!");
  }
};



  const handleDelete = async (userId) => {
    if (!window.confirm("Bạn chắc chắn muốn xoá?")) return;
    try {
      await axios.delete(`https://api-ndolv2.nongdanonline.cc/admin-users/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } });
      alert("Đã xoá người dùng!");
      fetchUsers();
    } catch {
      alert("Xoá thất bại!");
    }
  };

  const handleAddRole = async () => {
    if (!token || !selectedUser) return;
    try {
      await axios.post(`https://api-ndolv2.nongdanonline.cc/admin-users/${selectedUser.id}/add-role`,
        { role: selectedRole }, { headers: { Authorization: `Bearer ${token}` } });
      alert("Thêm role thành công!");
      fetchUsers();
    } catch {
      alert("Thêm role thất bại!");
    }
  };

  const handleRemoveRole = async (role) => {
    if (!token || !selectedUser) return;
    try {
      await axios.post(`https://api-ndolv2.nongdanonline.cc/admin-users/${selectedUser.id}/remove-roles`,
        { role }, { headers: { Authorization: `Bearer ${token}` } });
      alert("Xoá role thành công!");
      fetchUsers();
    } catch {
      alert("Xoá role thất bại!");
    }
  };

  return (
    <div className="p-4">
      <Typography variant="h6" color="blue-gray" className="mb-4">Quản lý người dùng</Typography>

     <div className="flex flex-wrap items-center gap-4 mb-4">
  <div className="w-64">
    <Input
      label="Tìm kiếm..."
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleSearch();
      }}
    />
  </div>

  <div className="w-52">
    <Select label="Trạng thái" value={filterStatus} onChange={val => setFilterStatus(val || "")}>
      <Option value="">Tất cả</Option>
      <Option value="Active">Active</Option>
      <Option value="Inactive">Inactive</Option>
    </Select>
  </div>

  <div className="w-52">
   <Select
  label="Lọc theo role"
  value={filterRole}
  onChange={(val) => setFilterRole(val ?? "")}
>
  <Option value="">Tất cả</Option>
  {roles.map(role => (
    <Option key={role} value={role}>{role}</Option>
  ))}
</Select>



  </div>

  <div>
    <Button className="bg-blue-500" onClick={handleSearch}>
      TÌM KIẾM
    </Button>
  </div>
</div>



      {loading && <div className="flex justify-center py-4"><Spinner /></div>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100">
              {["Avatar", "Tên", "Email", "Phone", "Role", "Posts", "Farms", "Videos", "Trạng thái", "Thao tác"].map(head => (
                <th key={head} className="p-2 text-left text-xs font-semibold">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-t hover:bg-blue-50 cursor-pointer"
                  onClick={() => navigate(`/dashboard/users/${user.id}`)}>
                <td className="p-2"><Avatar src={user.avatar ? `https://api-ndolv2.nongdanonline.cc${user.avatar}` : ""} size="sm" /></td>
                <td className="p-2">{user.fullName}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.phone || "N/A"}</td>
                <td className="p-2 text-xs">{Array.isArray(user.role) ? user.role.join(", ") : user.role}</td>
                <td className="p-2">{counts[user.id]?.posts ?? 0}</td>
                <td className="p-2">{counts[user.id]?.farms ?? 0}</td>
                <td className="p-2">{counts[user.id]?.videos ?? 0}</td>
                <td className="p-2">
                  {user.isActive
                    ? <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded">Active</span>
                    : <span className="bg-gray-500 text-white text-xs px-2 py-0.5 rounded">Inactive</span>}
                </td>
                <td className="p-2" onClick={e => e.stopPropagation()}>
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

      {!isSearching && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <Button size="sm" variant="outlined" disabled={page <= 1} onClick={() => setPage(prev => prev - 1)}>Trang trước</Button>
          <span>Trang {page} / {totalPages}</span>
          <Button size="sm" variant="outlined" disabled={page >= totalPages} onClick={() => setPage(prev => prev + 1)}>Trang sau</Button>
        </div>
      )}

    <Dialog open={editOpen} handler={setEditOpen} size="sm">
  <DialogHeader>Chỉnh sửa người dùng</DialogHeader>
  <DialogBody className="space-y-4">
    <Input
      label="Full Name"
      value={formData.fullName}
      onChange={e => setFormData({ ...formData, fullName: e.target.value })}
    />
    <Input label="Email" value={formData.email} disabled />
    <Input
      label="Phone"
      value={formData.phone}
      onChange={e => setFormData({ ...formData, phone: e.target.value })}
    />
    <Select
      label="Trạng thái"
      value={formData.isActive ? "Đã cấp quyền" : "Chưa cấp quyền"}
      onChange={val => setFormData({ ...formData, isActive: val === "Đã cấp quyền" })}
    >
      <Option>Đã cấp quyền</Option>
      <Option>Chưa cấp quyền</Option>
    </Select>

    <Typography className="font-bold">Địa chỉ</Typography>
    {formData.addresses?.map((addr, idx) => (
      <div key={idx} className="flex gap-2 mb-2">
        <Input
          label={`Địa chỉ ${idx + 1}`}
          value={addr}
          onChange={e => {
            const updated = [...formData.addresses];
            updated[idx] = e.target.value;
            setFormData({ ...formData, addresses: updated });
          }}
        />
        <Button
          variant="outlined"
          size="sm"
          onClick={() => {
            const updated = formData.addresses.filter((_, i) => i !== idx);
            setFormData({ ...formData, addresses: updated });
          }}
        >
          Xoá
        </Button>
      </div>
    ))}
    <Button
      size="sm"
      variant="outlined"
      onClick={() =>
        setFormData({ ...formData, addresses: [...formData.addresses, ""] })
      }
    >
      + Thêm địa chỉ
    </Button>

    <Typography className="font-bold">Quản lý role</Typography>
    <Select label="Thêm role" value={selectedRole} onChange={setSelectedRole}>
      {roles.map(role => (
        <Option key={role} value={role}>{role}</Option>
      ))}
    </Select>
    <Button size="sm" variant="outlined" onClick={handleAddRole}>
      + Thêm Role
    </Button>
    <div className="flex flex-wrap gap-2 mt-2">
      {(Array.isArray(selectedUser?.role) ? selectedUser.role : [selectedUser?.role])
        .filter(Boolean)
        .map(role => (
          <span
            key={`${selectedUser?.id}-${role}`}
            className="flex items-center bg-blue-gray-100 rounded-full px-2 py-1 text-xs"
          >
            {role}
            <button
              className="ml-1 text-red-500"
              onClick={() => handleRemoveRole(role)}
            >
              ×
            </button>
          </span>
        ))}
    </div>
  </DialogBody>
  <DialogFooter>
    <Button variant="text" onClick={() => setEditOpen(false)}>
      Huỷ
    </Button>
    <Button variant="gradient" onClick={handleUpdate}>
      Lưu
    </Button>
  </DialogFooter>
</Dialog>

    </div>
  );
}
