import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog, DialogHeader, DialogBody, Typography, Chip,
} from "@material-tailwind/react";
import FarmPictures from "./FarmPictures";

const BASE_URL = "https://api-ndolv2.nongdanonline.vn";
const getOpts = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export default function FarmDetail({ farmId, open, onClose }) {
  const [farm, setFarm] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!farmId) return;

    const fetchFarm = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/adminfarms/${farmId}`, getOpts());
        setFarm(res.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      }
    };

    fetchFarm();
  }, [farmId]);

  return (
    <Dialog open={open} handler={onClose} size="lg" className="max-w-screen-md mx-auto">
      <DialogHeader>Chi tiết nông trại</DialogHeader>
      <DialogBody>
        {error ? (
          <Typography color="red">Lỗi: {error}</Typography>
        ) : farm ? (
          <>
            <Typography variant="h6" className="mb-2">Tên: {farm.name}</Typography>
            <Typography>Mã: {farm.code}</Typography>
            <Typography>Chủ sở hữu: {farm.ownerInfo?.name || "—"}</Typography>
            <Typography>SĐT: {farm.phone || "—"}</Typography>
            <Typography>Địa chỉ: {farm.location}</Typography>
            <Typography>Diện tích: {farm.area} m²</Typography>
            <Typography>Mô tả: {farm.description || "Không có"}</Typography>

            {/* Dịch vụ */}
            <div className="mt-4">
              <Typography variant="h6">Dịch vụ</Typography>
              <div className="flex flex-wrap gap-2 mt-2">
                {farm.services?.length > 0 ? (
                  farm.services.map((service, idx) => (
                    <Chip
                      key={idx}
                      value={service}
                      color="teal"
                      size="sm"
                      className="rounded-full"
                    />
                  ))
                ) : (
                  <Typography>Không có</Typography>
                )}
              </div>
            </div>

            {/* Tính năng */}
            <div className="mt-4">
              <Typography variant="h6">Tính năng</Typography>
              <div className="flex flex-wrap gap-2 mt-2">
                {farm.features?.length > 0 ? (
                  farm.features.map((feature, idx) => (
                    <Chip
                      key={idx}
                      value={feature}
                      color="blue"
                      size="sm"
                      className="rounded-full"
                    />
                  ))
                ) : (
                  <Typography>Không có</Typography>
                )}
              </div>
            </div>

            {/* FarmPictures */}
            <div className="mt-6">
              <FarmPictures farmId={farmId} />
            </div>
          </>
        ) : (
          <Typography>Đang tải chi tiết...</Typography>
        )}
      </DialogBody>
    </Dialog>
  );
}
