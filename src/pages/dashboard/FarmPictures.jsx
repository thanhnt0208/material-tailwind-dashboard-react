import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography } from "@material-tailwind/react";

const BASE_URL = "https://api-ndolv2.nongdanonline.vn";
const getOpts = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export default function FarmPictures({ farmId }) {
  const [pictures, setPictures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!farmId) return;

    const fetchPictures = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/farm-pictures/${farmId}`, getOpts());
        setPictures(res.data);
      } catch (err) {
        if (err.response?.status === 404) {
          // Không tìm thấy => farm chưa có ảnh
          setPictures([]);
        } else {
          setError(err.response?.data?.message || err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPictures();
  }, [farmId]);

  if (loading) return <Typography>Đang tải ảnh...</Typography>;
  if (error) return <Typography color="red">Lỗi: {error}</Typography>;
  if (pictures.length === 0) return <Typography>Farm này chưa có ảnh nào.</Typography>;

  return (
    <div className="mt-4 grid grid-cols-3 gap-4">
      {pictures.map((pic) => (
        <div key={pic._id} className="border rounded-lg p-2">
          <img src={pic.url} alt="Farm" className="w-full h-48 object-cover rounded" />
          <Typography variant="small" className="mt-1 text-center">{pic.title || "Ảnh farm"}</Typography>
        </div>
      ))}
    </div>
  );
}
