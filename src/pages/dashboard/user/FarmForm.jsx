import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Input,
  Spinner
} from "@material-tailwind/react";
import axios from "axios";


const FarmForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [farm, setFarm] = useState({
    name: "",
    address: "",
    area: "",
    cultivatedArea: "",
    status: "",
  });
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);


  useEffect(() => {
    if(id) fetchFarm();
  }, [id]);

  const fetchFarm = async () => {
    try {
      const token = localStorage.getItem("token"); 
      const res = await axios.get(
        `https://api-ndolv2.nongdanonline.cc/adminfarms/${id}`, 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFarm(res.data); 
    } catch (err) {
      console.error("Failed to fetch farm:", err);
      setError("Không thể tải thông tin nông trại.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFarm({ ...farm, [e.target.name]: e.target.value }); 
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token"); 
    setSaving(true);
    try {
      if (id) {
        // ✅ [SỬA] Nếu có id → update
        await axios.put(
          `https://api-ndolv2.nongdanonline.cc/adminfarms/${id}`,
          farm,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        alert("Cập nhật nông trại thành công!");
      } else {
        // ✅ [SỬA] Nếu không có id → tạo mới
        await axios.post(
          `https://api-ndolv2.nongdanonline.cc/adminfarms`,
          farm,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        alert("Tạo nông trại mới thành công!");
      }
      navigate(-1); 
    } catch (err) {
      console.error("Failed to save farm:", err);
      setError("Không thể lưu nông trại.");
    } finally {
      setSaving(false);
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner className="h-12 w-12" color="blue" />
      </div>
    );
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <Card>
        <CardBody>
          <Typography variant="h5" className="mb-4">
            {id ? "Chỉnh sửa Nông trại" : "Tạo Nông trại Mới"} 
          </Typography>

          {error && (
            <Typography color="red" className="mb-2">
              {error} 
            </Typography>
          )}

          <div className="space-y-3">
            <Input
              label="Tên Nông trại"
              name="name"
              value={farm.name}
              onChange={handleChange}
            /> 
            <Input
              label="Địa chỉ"
              name="address"
              value={farm.address}
              onChange={handleChange}
            /> 
            <Input
              label="Diện tích (m²)"
              name="area"
              value={farm.area}
              onChange={handleChange}
            /> 
            <Input
              label="Diện tích canh tác (m²)"
              name="cultivatedArea"
              value={farm.cultivatedArea}
              onChange={handleChange}
            /> 
            <Input
              label="Trạng thái"
              name="status"
              value={farm.status}
              onChange={handleChange}
            /> 
          </div>

          <div className="flex justify-between mt-6">
            <Button color="blue" onClick={handleSubmit} disabled={saving}>
              {saving ? "Đang lưu..." : id ? "Cập nhật" : "Tạo mới"} 
            </Button>
            <Button color="gray" onClick={() => navigate(-1)}>
              Hủy 
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default FarmForm;
