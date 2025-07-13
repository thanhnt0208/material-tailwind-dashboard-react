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
  const [videoCount, setVideoCount] = useState(0);
  const [showChanges, setShowChanges] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [loadingAnswers, setLoadingAnswers] = useState(true);

  const getOpts = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  });

  const fetchDetail = async () => {
    if (!farmId) return;
    try {
      const res = await axios.get(`${BASE_URL}/adminfarms/${farmId}`, getOpts());
      const data = res.data?.data || res.data;
      setFarm(data);
    } catch (err) {
      console.error("❌ Lỗi fetchDetail:", err);
      setError(err.response?.data?.message || err.message);
      setFarm(null);
    }
  };

  const fetchImages = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/farm-pictures/${farmId}`, getOpts());
      setImages(res.data.data || []);
    } catch (err) {
      console.error("Lỗi ảnh:", err);
    }
  };

  const fetchFarmVideos = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/adminfarms/${farmId}/video-count`, getOpts());
      setVideoCount(res.data.count || 0);
    } catch (err) {
      console.error("Lỗi video:", err);
      setVideoCount(0);
    }
  };

  const fetchQuestions = async () => {
    setLoadingQuestions(true);
    try {
      const res = await axios.get(`${BASE_URL}/admin-questions`, getOpts());
      setQuestions(res.data || []);
    } catch (err) {
      console.error("Lỗi câu hỏi:", err);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const fetchAnswers = async () => {
    setLoadingAnswers(true);
    try {
      const res = await axios.get(`${BASE_URL}/answers/by-farm/${farmId}`, getOpts());
      setAnswers(res.data || []);
    } catch (err) {
      console.error("Lỗi câu trả lời:", err);
    } finally {
      setLoadingAnswers(false);
    }
  };

  const handleToggleChanges = async () => {
    if (!showChanges) {
      await fetchQuestions();
      await fetchAnswers();
    }
    setShowChanges(!showChanges);
  };

  useEffect(() => {
    console.log("📌 Dialog open =", open, "| farmId =", farmId);
    if (open && farmId) {
      fetchDetail();
      fetchImages();
      fetchFarmVideos();
    }
  }, [open, farmId]);

  if (!open) return null;

  return (
    <div className="max-h-screen overflow-y-auto p-4 bg-white rounded-md shadow-md">
      <div className="max-w-6xl mx-auto space-y-6">
        {error && <Typography color="red">{error}</Typography>}

        {farm === null ? (
          <Typography className="text-indigo-500">Đang tải...</Typography>
        ) : !farm ? (
          <Typography color="red">Không tìm thấy dữ liệu</Typography>
        ) : (
          <>
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

            {farm.description && (
              <div>
                <Typography variant="h6" className="mb-2 text-blue-gray-900">Mô tả</Typography>
                <Typography className="text-sm text-blue-gray-700 whitespace-pre-wrap">
                  {farm.description}
                </Typography>
              </div>
            )}

            <div>
              <Typography variant="h6" className="mb-2 text-blue-gray-900">Hình ảnh</Typography>
              {images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {images.map((img, idx) => (
                    <div key={img.id || idx} className="relative group">
                      <img
                        src={`https://api-ndolv2.nongdanonline.cc${img.url || img.path || img.image}`}
                        alt={`Ảnh ${idx + 1}`}
                        className="w-full h-40 object-cover rounded-lg border shadow-sm transition-transform group-hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <Typography className="text-sm text-gray-500 italic mb-4">Chưa có hình ảnh</Typography>
              )}
            </div>

            <div className="mt-6">
              <Button onClick={handleToggleChanges} color="blue" variant="outlined" size="sm">
                {showChanges ? "Ẩn biến động" : "Xem biến động"}
              </Button>
            </div>

            {showChanges && (
              <div className="space-y-6 p-4 border border-gray-200 rounded-lg bg-white shadow-inner">
                <Typography variant="h6" className="text-blue-gray-900">Danh sách câu hỏi và câu trả lời</Typography>
                {loadingQuestions || loadingAnswers ? (
                  <Typography className="text-sm text-blue-500">Đang tải dữ liệu...</Typography>
                ) : questions.length === 0 ? (
                  <Typography className="text-sm text-gray-500 italic">Không có câu hỏi nào.</Typography>
                ) : (
                  <div className="space-y-4">
                    {questions.map((q, idx) => {
                      const match = answers.find((a) => a.question?._id === q._id);
                      const ans = match?.answer;

                      return (
                        <div key={q._id} className="border p-3 rounded-lg bg-gray-50">
                          <Typography className="text-sm font-semibold text-gray-800">
                            {idx + 1}. {q.text}
                          </Typography>

                          {ans ? (
                            <div className="mt-1 space-y-1 text-sm text-blue-gray-700">
                              {ans.selectedOptions?.length > 0 && (
                                <div>Chọn: {ans.selectedOptions.join(", ")}</div>
                              )}
                              {ans.otherText && <div>Khác: {ans.otherText}</div>}
                              {ans.uploadedFiles?.length > 0 && (
                                <div className="space-y-1">
                                  {ans.uploadedFiles.map((f, i) => (
                                    <a
                                      key={i}
                                      href={f}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-500 underline block"
                                    >
                                      File {i + 1}
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                          ) : (
                            <Typography className="text-sm text-red-500 italic mt-1">
                              Chưa có câu trả lời
                            </Typography>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
