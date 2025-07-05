import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card, CardBody, Input, Button, Typography, Checkbox, Chip, Tabs, TabsHeader, Tab,
  Dialog,
  DialogHeader,
  DialogBody
} from "@material-tailwind/react";
import {
  PencilSquareIcon, TrashIcon, PlusIcon,
} from "@heroicons/react/24/solid";
import FarmForm from "./farmForm";

const BASE_URL = "https://api-ndolv2.nongdanonline.vn";
const getOpts = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});


export function Farms() {
  const [farms, setFarms] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [tab, setTab] = useState("all")
  const [search, setSearch] = useState("");

  const [openForm, setOpenForm] = useState(false);
  const [editingFarm, setEditingFarm] = useState(null);

  const [selectedFarm, setSelectedFarm] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);

  const fetchFarms = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/adminfarms`, getOpts());
      setFarms(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const getFarmDetail = async (id) => {
    try {
      const res = await axios.get(`${BASE_URL}/adminfarms/${id}`, getOpts());
      setSelectedFarm(res.data);
      setOpenDetail(true);
    }catch (err) {
      alert("Lỗi lấy chi tiết: " + (err.response?.data?.message || err.message));
    }
  };

  const addFarm = async (data) => {
    try {
      await axios.post(`${BASE_URL}/adminfarms`, data, getOpts());
      await fetchFarms();
      alert(" Tạo farm thành công!");
    } catch (err) {
      alert("Lỗi thêm: " + (err.response?.data?.message || err.message)); 
    }
  };

  const editFarm = async (id, data) => {
    try {
      await axios.put(`${BASE_URL}/adminfarms/${id}`, data, getOpts());
      await fetchFarms();
    } catch (err) {
      alert("Lỗi sửa: " + (err.response?.data?.message || err.message));
    }
  };

  const deleteFarm = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá không?")) return;
    console.log(" Xoá farm với id:", id);
    try {
      await axios.delete(`${BASE_URL}/adminfarms/${id}`, getOpts());
      setFarms((prevFarms) => prevFarms.filter((farm) => farm._id !== id));
    } catch (err) {
      alert("Lỗi xoá: " + (err.response?.data?.message || err.message));
    }
  };

  const activateFarm = async (id) => {
    try {
      await axios.patch(`${BASE_URL}/adminfarms/${id}/activate`, null, getOpts());
      await fetchFarms();
    }catch (err) {
      alert("Lỗi kích hoạt: " + (err.response?.data?.message || err.message));
    }
  }

  const deactivateFarm = async (id) => {
    try {
      await axios.patch(`${BASE_URL}/adminfarms/${id}/deactivate`, null, getOpts());
      await fetchFarms();
    }catch (err) {
      alert("Lỗi kích hoạt: " + (err.response?.data?.message || err.message));
    }
  }

  useEffect(() => {
    fetchFarms();
  }, []);

  const displayedFarms = farms
  .filter((farm) => {
    if (tab === "all") return true;
    return farm.status === tab;
  })
  .filter((farm) =>
    farm.name?.toLowerCase().includes(search.toLowerCase())
  );

  const approveFarm = (id) => activateFarm(id);
  const rejectFarm = (id) => deactivateFarm(id);
  return (
    <>
      <Card className="p-6 shadow-md rounded-xl bg-white">
        <div className="flex items-center justify-between mb-6">
          <Typography variant="h4" className="text-indigo-600">
            Quản lý nông trại
          </Typography>

          <Tabs value={tab} className="w-full lg:w-auto">
            <TabsHeader className="flex-nowrap overflow-x-auto whitespace-nowrap gap-2">
              <Tab value="all" onClick={() => setTab("all")}>
                Tất cả
              </Tab>
              <Tab value="pending" onClick={() => setTab("pending")}>
                Chờ duyệt
              </Tab>
              <Tab value="active" onClick={() => setTab("active")}>
                Đang hoạt động
              </Tab>
              <Tab value="inactive" onClick={() => setTab("inactive")}>
                Đã khoá
              </Tab>
            </TabsHeader>
          </Tabs>

          <Button onClick={() => {
            setEditingFarm(null);
            setOpenForm(true);
            }} 
            color="indigo" className="flex items-center gap-2">
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
                  {["Tên", "Mã", "Chủ sở hữu", "SĐT", "Địa chỉ", "Diện tích", "Trạng thái", "Thao tác"].map((head) => (
                    <th key={head} className="px-4 py-3 text-xs font-bold uppercase">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayedFarms.map((farm) => (
                  <tr key={farm._id} className="border-b hover:bg-indigo-50 transition"
                  onClick={() => getFarmDetail(farm._id)}>
                    <td className="px-4 py-4"><Checkbox ripple={false} /></td>
                    <td className="px-4 py-4">{farm.name}</td>
                    <td className="px-4 py-4">{farm.code}</td>
                    <td className="px-4 py-4">{farm.ownerInfo?.name || "—"}</td>
                    <td className="px-4 py-4">{farm.phone || "—"}</td>
                    <td className="px-4 py-4">{farm.location}</td>
                    <td className="px-4 py-4">{farm.area} m²</td>
                    <td className="px-4 py-4">
                      <Chip
                        value={farm.status === "pending" ? "Chờ duyệt" : farm.status === "active" ? "Đang hoạt động" : "Đã khóa"}
                        color={farm.status === "pending" ? "amber" : farm.status === "inactive" ? "red" : "teal"}
                        size="sm"
                      />
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2 justify-start items-center">
                        {/* Sửa */}
                        <Button
                          size="sm"
                          onClick={(e) => { e.stopPropagation(); setEditingFarm(farm); setOpenForm(true); }}
                          className="bg-blue-600 text-white px-3 py-1 rounded-md shadow-md hover:bg-blue-700"
                        >
                          <PencilSquareIcon className="h-4 w-4 mr-1" /> Sửa
                        </Button>

                        {/* Xoá */}
                        <Button
                          size="sm"
                          onClick={(e) =>{e.stopPropagation(); deleteFarm(farm._id);}}
                          className="bg-gray-200 text-gray-800 px-3 py-1 rounded-md shadow-md hover:bg-gray-300"
                        >
                          <TrashIcon className="h-4 w-4 mr-1" /> Xoá
                        </Button>

                        {/* Theo trạng thái */}
                        {farm.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => activateFarm(farm._id)}
                              className="bg-green-500 text-white px-3 py-1 rounded-md shadow-md hover:bg-green-600"
                            >
                              Duyệt
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => deactivateFarm(farm._id)}
                              className="bg-yellow-400 text-white px-3 py-1 rounded-md shadow-md hover:bg-yellow-500"
                            >
                              Từ chối
                            </Button>
                          </>
                        )}

                        {farm.status === "inactive" && (
                          <Button
                            size="sm"
                            onClick={() => activateFarm(farm._id)}
                            className="bg-green-500 text-white px-3 py-1 rounded-md shadow-md hover:bg-green-600"
                          >
                            Kích hoạt
                          </Button>
                        )}

                        {farm.status === "active" && (
                          <Button
                            size="sm"
                            onClick={() => deactivateFarm(farm._id)}
                            className="bg-yellow-400 text-white px-3 py-1 rounded-md shadow-md hover:bg-yellow-500"
                          >
                            Vô hiệu hoá
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        )}
      </Card>

      <Dialog open={openDetail} handler={() => setOpenDetail(false)} size="lg" className="max-w-screen-md mx-auto">
        <DialogHeader>Chi tiết nông trại</DialogHeader> 
        <DialogBody>
          {selectedFarm ? (
            <div className="space-y-3">
              <Typography variant="h6">Tên: {selectedFarm.name}</Typography>
              <Typography>Mã: {selectedFarm.code}</Typography>
              <Typography>Chủ sở hữu: {selectedFarm.ownerInfo.name}</Typography>
              <Typography>SĐT: {selectedFarm.phone}</Typography>
              <Typography>Địa chỉ: {selectedFarm.location}</Typography>
              <Typography>Diện tích: {selectedFarm.area} m²</Typography>
              <Typography>Mô tả: {selectedFarm.description || "Không có"}</Typography>

              {/* Dịch vụ */}
              <div className="flex flex-col gap-3">
                <Typography variant="h6" className="mt-4">Dịch vụ</Typography>
                <div className="flex flex-wrap gap-2">
                  {[
                    "direct_selling",
                    "feed_selling",
                    "custom_feed_blending",
                    "processing_service",
                    "storage_service",
                    "transport_service",
                    "other_services",
                  ]. map((service) => (
                    <Chip key={service} value={service.replace(/_/g, " ")}
                    color={selectedFarm.service?.includes(service) ? "green" : "gray"}
                    variant={selectedFarm.service?.includes(service) ? "filled" : "outlined"}
                    size="sm"
                    ></Chip>
                  ))}
                </div>
              </div>
              {/* Tính năng */}
              <div className="flex flex-col gap-3">
                <Typography variant="h6" className="mt-4"> Tính năng</Typography>
                <div className="flex flex-wrap gap-2">
                  {[
                    "aquaponic_model",
                    "ras_ready",
                    "hydroponic",
                    "greenhouse",
                    "vertical_farming",
                    "viet_gap_cert",
                    "organic_cert",
                    "global_gap_cert",
                    "haccp_cert",
                    "camera_online",
                    "drone_monitoring",
                    "automated_pest_detection",
                    "precision_irrigation",
                    "auto_irrigation",
                    "soil_based_irrigation",
                    "iot_sensors",
                    "soil_moisture_monitoring",
                    "air_quality_sensor",
                  ].map((feature) => (
                    <Chip key={feature} value={feature.replace(/_/g, "")}
                    color={selectedFarm.feature?.includes(feature) ? "teal" : "gray"}
                    variant={selectedFarm.feature?.includes(feature) ? "filled" : "outlined"}
                    size="sm"
                    ></Chip>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <Typography>Đang tải chi tiết...</Typography>
          )}  
        </DialogBody>  
      </Dialog>

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