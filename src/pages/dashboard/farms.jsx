import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card, CardBody, Input, Button, Typography, Checkbox, Chip,
} from "@material-tailwind/react";
import {
  PencilSquareIcon, TrashIcon, PlusIcon,
} from "@heroicons/react/24/solid";
import FarmForm from "./farmForm";

export function Farms() {
  const [farms, setFarms] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [editingFarm, setEditingFarm] = useState(null);

  const fetchFarms = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://api-ndolv2.nongdanonline.vn/adminfarms", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFarms(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarms();
  }, []);

  const addFarm = async (newFarm) => {
    try {
      const token = localStorage.getItem("token");

      const completedFarm = {
        ...newFarm,
        ownerInfo: {
          name: newFarm.ownerInfo?.name || "Chưa rõ",
          phone: newFarm.ownerInfo?.phone || "",
          email: newFarm.ownerInfo?.email || "",
        },
        coordinates: {
          lat: newFarm.coordinates?.lat || 0,
          lng: newFarm.coordinates?.lng || 0,
        },
        features: newFarm.features || [],
        phone: newFarm.phone || "",
        zalo: newFarm.zalo || "",
        operationTime: newFarm.operationTime || "",
        defaultImage: newFarm.defaultImage || "",
        services: newFarm.services || [],
      };

      console.log("📦 Dữ liệu gửi đi:", completedFarm);

      await axios.post("https://api-ndolv2.nongdanonline.vn/adminfarms", completedFarm, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(" Tạo farm thành công!");
      fetchFarms();
    } catch (err) {
      console.error(" Lỗi tạo farm:", {
        status: err.response?.status,
        data: err.response?.data,
      });
      alert("Lỗi thêm: " + (err.response?.data?.message || err.message));
    }
  };

  const editFarm = async (id, updatedFarm) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`https://api-ndolv2.nongdanonline.vn/adminfarms/${id}`, updatedFarm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchFarms();
    } catch (err) {
      alert("Lỗi sửa: " + (err.response?.data?.message || err.message));
    }
  };

  const deleteFarm = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá không?")) return;
    console.log(" Xoá farm với id:", id);
    try {
      const token = localStorage.getItem("token");
await axios.delete(`https://api-ndolv2.nongdanonline.vn/adminfarms/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFarms((prevFarms) => prevFarms.filter((farm) => farm._id !== id));
    } catch (err) {
      alert("Lỗi xoá: " + (err.response?.data?.message || err.message));
    }
  };

  const handleAddClick = () => {
    setEditingFarm(null);
    setOpenForm(true);
  };

  const handleEditClick = (farm) => {
    setEditingFarm(farm);
    setOpenForm(true);
  };

  const filteredFarms = farms.filter((farm) =>
    farm.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Card className="p-6 shadow-md rounded-xl bg-white">
        <div className="flex items-center justify-between mb-6">
          <Typography variant="h4" className="text-indigo-600">Danh sách nông trại</Typography>
          <Button onClick={handleAddClick} color="indigo" className="flex items-center gap-2">
            <PlusIcon className="h-5 w-5" /> Thêm nông trại
          </Button>
        </div>
        <Input
          label="Tìm kiếm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-6"
        />
        {loading ? (
          <Typography className="text-indigo-500">Đang tải dữ liệu...</Typography>
        ) : error ? (
          <Typography color="red">Lỗi: {error}</Typography>
        ) : (
          <CardBody className="overflow-x-auto p-0">
            <table className="w-full min-w-[1100px] table-auto">
              <thead>
                <tr className="bg-indigo-50 text-indigo-600 text-left">
                  <th className="w-10 px-4"><Checkbox ripple={false} /></th>
                  {["Tên", "Mã", "Chủ sở hữu", "SĐT", "Địa chỉ", "Diện tích", "Giá", "Trạng thái", "Thao tác"].map((head) => (
                    <th key={head} className="px-4 py-3 text-xs font-bold uppercase">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredFarms.map((farm) => (
                  <tr key={farm._id} className="border-b hover:bg-indigo-50 transition">
                    <td className="px-4 py-4"><Checkbox ripple={false} /></td>
                    <td className="px-4 py-4">{farm.name}</td>
                    <td className="px-4 py-4">{farm.code}</td>
                    <td className="px-4 py-4">{farm.ownerInfo?.name || "—"}</td>
                    <td className="px-4 py-4">{farm.ownerInfo?.phone || "—"}</td>
                    <td className="px-4 py-4">{farm.location}</td>
                    <td className="px-4 py-4">{farm.area} m²</td>
                    <td className="px-4 py-4">{farm.pricePerMonth?.toLocaleString("vi-VN") || "0"} đ</td>
                    <td className="px-4 py-4">
                      <Chip
                        value={farm.status === "pending" ? "Chờ duyệt" : farm.status}
color={farm.status === "pending" ? "amber" : "teal"}
                        size="sm"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleEditClick(farm)}
                          className="bg-indigo-500 text-white hover:bg-indigo-600"
                        >
                          <PencilSquareIcon className="h-4 w-4" /> Sửa
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => deleteFarm(farm._id)}
                          className="bg-rose-100 text-rose-600 hover:bg-rose-200"
                        >
                          <TrashIcon className="h-4 w-4" /> Xoá
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        )}
      </Card>

      <FarmForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        initialData={editingFarm}
        onSubmit={(data) => {
          editingFarm ? editFarm(editingFarm._id, data) : addFarm(data);
        }}
      />
    </>
  );
}

export default Farms