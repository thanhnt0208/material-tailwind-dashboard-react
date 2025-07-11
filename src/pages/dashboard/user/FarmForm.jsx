import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import axios from "axios";
import FarmForm from "./FarmForm";

const FarmDetail = () => {
  const { id } = useParams();
  const [farm, setFarm] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchFarm();
  }, [id]);

  const fetchFarm = async () => {
    try {
      const res = await axios.get(`/api/farms/${id}`);
      setFarm(res.data);
    } catch (err) {
      console.error("Failed to fetch farm:", err);
    }
  };

  const handleUpdate = async (updatedFarm) => {
    try {
      await axios.put(`/api/farms/${id}`, updatedFarm);
      setFarm(updatedFarm);
    } catch (err) {
      console.error("Failed to update farm:", err);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await axios.post(`/api/farms/${id}/upload-image`, formData);
      setFarm((prev) => ({ ...prev, image: res.data.imageUrl }));
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  if (!farm) return <div>Đang tải...</div>;

  return (
    <div className="p-4">
      <Card>
        <CardBody>
          <div className="flex justify-between items-center mb-4">
            <Typography variant="h5">Thông tin Nông trại</Typography>
            <Button color="blue" onClick={() => setOpenEdit(true)}>
              Chỉnh sửa
            </Button>
          </div>

          <div className="mb-4">
            <Typography variant="small">Tên: {farm.name}</Typography>
            <Typography variant="small">Mã: {farm.code}</Typography>
            <Typography variant="small">Vị trí: {farm.location}</Typography>
            <Typography variant="small">Diện tích: {farm.area} m²</Typography>
            <Typography variant="small">Diện tích canh tác: {farm.cultivatedArea} m²</Typography>
            <Typography variant="small">
              Sẵn sàng: {farm.isAvailable ? "Có" : "Không"}
            </Typography>
            <Typography variant="small">
              Trạng thái: {farm.status || "Chưa xác định"}
            </Typography>
            <Typography variant="small">
              Tags: {farm.tags?.join(", ") || "Không có"}
            </Typography>
            <Typography variant="small">
              Dịch vụ: {farm.services?.join(", ") || "Không có"}
            </Typography>
            <Typography variant="small">
              Tính năng: {farm.features?.join(", ") || "Không có"}
            </Typography>
          </div>

          <div className="mb-4">
            <Typography variant="small">Hình ảnh:</Typography>
            {farm.image ? (
              <img
                src={farm.image}
                alt="Farm"
                className="w-full max-w-sm border rounded my-2"
              />
            ) : (
              <Typography variant="small" className="italic">
                Chưa có hình ảnh
              </Typography>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="mt-2"
            />
          </div>
        </CardBody>
      </Card>

      <FarmForm
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        initialData={farm}
        onSubmit={handleUpdate}
      />
    </div>
  );
};

export default FarmDetail;
