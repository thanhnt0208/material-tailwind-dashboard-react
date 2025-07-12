import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Button } from "@material-tailwind/react";

const BASE_URL = "https://api-ndolv2.nongdanonline.cc";


const Info = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <Typography className="text-sm font-medium text-gray-800">{label}</Typography>
    <Typography className="text-sm text-blue-gray-700">
      {value !== null && value !== undefined && value !== "" ? value : "—"}
    </Typography>
  </div>
);

const mapToLabel = (arr, options) => {
  if (!arr || arr.length === 0) return "—";
  const values = typeof arr === "string" ? arr.split(",").map((v) => v.trim()) : arr;
  return values.map((v) => options.find((o) => o.value === v)?.label || v).join(", ");
};

const serviceOptions = [
  { label: "Bán trực tiếp", value: "direct_selling" },
  { label: "Bán thức ăn", value: "feed_selling" },
  { label: "Phối trộn thức ăn", value: "custom_feed_blending" },
  { label: "Dịch vụ sơ chế", value: "processing_service" },
  { label: "Dịch vụ lưu kho", value: "storage_service" },
  { label: "Dịch vụ vận chuyển", value: "transport_service" },
  { label: "Dịch vụ khác", value: "other_services" },
];

const featureOptions = [
  { label: "Mô hình aquaponic", value: "aquaponic_model" },
  { label: "Chứng nhận VietGAP", value: "viet_gap_cert" },
  { label: "Chứng nhận hữu cơ", value: "organic_cert" },
  { label: "Nông trại thông minh", value: "smart_farm" },
  { label: "Tự động hóa", value: "automation" },
  { label: "Sử dụng IoT", value: "iot_enabled" },
];

export default function FarmDetail({ open, onClose, farmId }) {
  const [farm, setFarm] = useState(null);
  const [error, setError] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [videoCount, setVideoCount] = useState(0); 

  const fetchDetail = async () => {
    if (!farmId) return;
    try {
      const res = await axios.get(`${BASE_URL}/adminfarms/${farmId}`, getOpts());
      setFarm(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const getOpts = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error(" Không tìm thấy token trong localStorage");
    return {};
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    console.log(" Roles trong token:", payload.role);

    if (payload.role.includes("Admin")) {
      console.log(" Đã có quyền Admin");
    } else {
      console.warn(" Token này không có Admin role. Gọi API sẽ lỗi 403.");
    }
  } catch (e) {
    console.error(" Lỗi khi decode token:", e);
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};



console.log("FarmID:", farmId);
const fetchImages = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/farm-pictures/${farmId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
           Accept: "application/json", 
          "User-Agent": "Swagger-UI/5.10.0",
        },
      });
      setImages(res.data.data || []);
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message || err.message;

      if (status === 401) {
        alert("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");
        localStorage.removeItem("token");
        window.location.href = "/login";
      } else if (status === 403) {
        console.error(" 403 Forbidden - Không có quyền truy cập API");
        alert("Bạn không có quyền xem hình ảnh này.");
      } else {
        console.error(" Lỗi khi lấy ảnh:", message);
        alert("Lỗi khi lấy ảnh: " + message);
      }
    }
  };




  const fetchFarmVideos = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin-video-farm`, getOpts());
      if (res.status === 200) {
        const allVideos = res.data.data
        const count = allVideos.filter((v) => v.farmId?.id === farmId).length;
        setVideoCount(count);
      }
    } catch (err) {
      console.error("Lỗi khi lấy danh sách video:", err);
    }
  };

  const handleFileChange = (e) => setSelectedFiles([...e.target.files]);

  const handleUpload = async () => {
    if (!selectedFiles.length || !farmId) return;

    setUploading(true);
    try {
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append("file", file);

        await axios.post(`${BASE_URL}/farm-pictures/${farmId}`, formData, {
          ...getOpts(),
          headers: {
            ...getOpts().headers,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      setSelectedFiles([]);
      await fetchImages();
    } catch (err) {
      alert("Upload thất bại: " + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (open && farmId) {
      fetchDetail();
      fetchImages();
      fetchFarmVideos(); 
    }
  }, [open, farmId]);

  if (!open) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {error && <Typography color="red">{error}</Typography>}

      {!farm ? (
        <Typography className="text-indigo-500">Đang tải...</Typography>
      ) : (
        <>
          {/* Thông tin nông trại */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Info label="Tên nông trại" value={farm.name} />
            <Info label="Mã nông trại" value={farm.code} />
            <Info label="Tags" value={(farm.tags || []).join(", ")} />
            <Info
              label="Trạng thái"
              value={
                farm.status === "pending"
                  ? "Chờ duyệt"
                  : farm.status === "active"
                  ? "Đang hoạt động"
                  : "Đã khóa"
              }
            />
            <Info label="Tỉnh/Thành phố" value={farm.province} />
            <Info label="Quận/Huyện" value={farm.district} />
            <Info label="Phường/Xã" value={farm.ward} />
            <Info label="Đường" value={farm.street} />
            <Info label="Vị trí tổng quát" value={farm.location} />
            <Info label="Tổng diện tích (m²)" value={farm.area} />
            <Info label="Đất canh tác (m²)" value={farm.cultivatedArea} />
            <Info label="Dịch vụ" value={mapToLabel(farm.services, serviceOptions)} />
            <Info label="Tính năng" value={mapToLabel(farm.features, featureOptions)} />
            <Info label="Chủ sở hữu" value={farm.ownerInfo?.name} />
            <Info label="Số điện thoại" value={farm.phone} />
            <Info label="Zalo" value={farm.zalo} />
            <Info label="Số video nông trại" value={videoCount} />
          </div>

          {/* Mô tả */}
          {farm.description && (
            <div>
              <Typography variant="h6" className="mb-2 text-blue-gray-900">Mô tả</Typography>
              <Typography className="text-sm text-blue-gray-700 whitespace-pre-wrap">
                {farm.description}
              </Typography>
            </div>
          )}

          {/* Hình ảnh */}
          <div>
            <Typography variant="h6" className="mb-2 text-blue-gray-900">Hình ảnh</Typography>

            {images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={`${BASE_URL}${img.url}`} 
                  alt={`Ảnh ${idx + 1}`}
                  className="w-full h-40 object-cover rounded-lg border shadow-sm"
                />
              ))}
            </div>
          ) : (
            <Typography className="text-sm text-gray-500 italic mb-4">
              Chưa có hình ảnh
            </Typography>
          )}


            {farm.status === "active" ? (
              <div className="flex flex-wrap gap-2 items-center">
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="block w-56 text-sm text-gray-700
                            file:mr-2 file:py-1 file:px-3
                            file:rounded-lg file:border file:border-gray-300
                            file:text-sm file:font-medium
                            file:bg-white file:text-gray-700
                            hover:file:bg-gray-50"
                />
                <Button
                  onClick={handleUpload}
                  disabled={uploading || !selectedFiles.length}
                  color="indigo"
                  className="text-sm px-4 py-2"
                >
                  {uploading ? "Đang tải..." : "Tải ảnh lên"}
                </Button>
              </div>
            ) : (
              <Typography className="text-sm text-red-500 italic">
                Chỉ nông trại đang hoạt động mới được phép thêm hình ảnh.
              </Typography>
            )}
          </div>
        </>
      )}
    </div>
  );
}
