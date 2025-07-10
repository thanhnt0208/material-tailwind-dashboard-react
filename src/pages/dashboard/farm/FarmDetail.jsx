import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = "https://api-ndolv2.nongdanonline.vn";
const getOpts = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});
// serviceOptions và featureOptions ánh xạ tiếng Việt
const serviceOptions = [
  { value: "direct_selling", label: "Bán hàng trực tiếp" },
  { value: "feed_selling", label: "Bán thức ăn chăn nuôi" },
  { value: "custom_feed_blending", label: "Pha trộn thức ăn theo yêu cầu" },
  { value: "processing_service", label: "Dịch vụ chế biến" },
  { value: "storage_service", label: "Dịch vụ lưu trữ" },
  { value: "transport_service", label: "Dịch vụ vận chuyển" },
  { value: "other_services", label: "Dịch vụ khác" },
];

const featureOptions = [
  { value: "aquaponic_model", label: "Mô hình Aquaponic" },
  { value: "ras_ready", label: "Hệ thống RAS" },
  { value: "hydroponic", label: "Thuỷ canh" },
  { value: "greenhouse", label: "Nhà kính" },
  { value: "vertical_farming", label: "Nông trại thẳng đứng" },
  { value: "viet_gap_cert", label: "Chứng nhận VietGAP" },
  { value: "organic_cert", label: "Chứng nhận hữu cơ" },
  { value: "global_gap_cert", label: "Chứng nhận GlobalGAP" },
  { value: "haccp_cert", label: "Chứng nhận HACCP" },
  { value: "camera_online", label: "Camera trực tuyến" },
  { value: "drone_monitoring", label: "Giám sát bằng drone" },
  { value: "automated_pest_detection", label: "Phát hiện sâu bệnh tự động" },
  { value: "precision_irrigation", label: "Tưới tiêu chính xác" },
  { value: "auto_irrigation", label: "Tưới tiêu tự động" },
  { value: "soil_based_irrigation", label: "Tưới theo độ ẩm đất" },
  { value: "iot_sensors", label: "Cảm biến IoT" },
  { value: "soil_moisture_monitoring", label: "Giám sát độ ẩm đất" },
  { value: "air_quality_sensor", label: "Cảm biến chất lượng không khí" },
];

// Hàm chuyển value -> label
const mapToLabel = (values, options) =>
  (values || [])
    .map((val) => options.find((opt) => opt.value === val)?.label || val)
    .join(", ");

const FarmDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [farm, setFarm] = useState(null);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    const fetchFarm = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/adminfarms/${id}`, getOpts());
        setFarm(res.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      }
    };
    fetchFarm();
  }, [id]);

  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files);
  };

  const handleUpload = async () => {
    if (!selectedFiles.length) return;

    const formData = new FormData();
    for (let file of selectedFiles) {
      formData.append("images", file);
    }

    try {
      setUploading(true);
      await axios.post(`${BASE_URL}/adminfarms/${id}/images`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Refresh farm data
      const res = await axios.get(`${BASE_URL}/adminfarms/${id}`, getOpts());
      setFarm(res.data);
      setSelectedFiles([]);
    } catch (err) {
      alert("Upload thất bại: " + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-indigo-700">Chi tiết Nông trại</h1>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Thoát
          </button>
        </div>

        {error && <p className="text-red-500">Lỗi: {error}</p>}
        {!farm ? (
          <p className="text-gray-500">Đang tải dữ liệu...</p>
        ) : (
          <div className="space-y-6 bg-white p-6 rounded-xl shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p><strong>Tên nông trại:</strong> {farm.name}</p>
              <p><strong>Vị trí:</strong> {farm.location}</p>
              <p><strong>Diện tích (m²):</strong> {farm.area}</p>
              <p><strong>Diện tích đất canh tác (m²):</strong> {farm.cultivationArea}</p>
              <p><strong>Dịch vụ:</strong> {mapToLabel(farm.services, serviceOptions)}</p>
              <p><strong>Tính năng:</strong> {mapToLabel(farm.features, featureOptions)}</p>
              <p><strong>Tags:</strong> {(farm.tags || []).join(", ")}</p>
              <p><strong>Số điện thoại:</strong> {farm.phone}</p>
              <p><strong>Zalo:</strong> {farm.zalo || "—"}</p>
              <p><strong>Tỉnh/Thành phố:</strong> {farm.province}</p>
              <p><strong>Quận/Huyện:</strong> {farm.district}</p>
              <p><strong>Phường/Xã:</strong> {farm.ward}</p>
              <p><strong>Đường:</strong> {farm.street}</p>
              <p><strong>ID Chủ sở hữu:</strong> {farm.ownerId}</p>
              <p><strong>Chủ sở hữu:</strong> {farm.ownerInfo?.name || "—"}</p>
              <p><strong>Trạng thái:</strong> {
                farm.status === "pending" ? "Chờ duyệt" :
                farm.status === "active" ? "Đang hoạt động" :
                "Đã khóa"
              }</p>

              {/* Cập nhật hình ảnh */}
              <div className="col-span-1 md:col-span-2">
                <h2 className="text-lg font-semibold text-gray-700 mb-2"> hình ảnh nông trại:</h2>

                {farm.images && farm.images.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {farm.images.map((img, index) => (
                      <img
                        key={index}
                        src={typeof img === "string" ? img : img.url}
                        alt={`Ảnh ${index + 1}`}
                        className="w-full h-40 object-cover rounded-lg border"
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic mb-4">Chưa có hình ảnh</p>
                )}

                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="border border-gray-300 rounded px-3 py-1"
                  />
                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className={`px-4 py-2 rounded text-white ${uploading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"}`}
                  >
                    {uploading ? "Đang tải..." : "Tải ảnh lên"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmDetail;
