


import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Input,
  Textarea,
  Button,
  Typography,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  IconButton,
  Select as MTSelect,
  Spinner,
  Option,
} from "@material-tailwind/react";
import axios from "axios";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Select from "react-select";

const BASE_URL = "https://api-ndolv2.nongdanonline.cc";

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

export default function FarmFormDialog({ farmId, open, onClose, onSubmitSuccess }) {
  const [form, setForm] = useState({
    name: "",
    code: "",
    tags: "",
    province: "",
    district: "",
    ward: "",
    street: "",
    location: "",
    area: "",
    cultivatedArea: "",
    phone: "",
    zalo: "",
    description: "",
    services: [],
    features: [],
    ownerInfo: { name: "" },
    status: "pending",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getOpts = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };



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
    if (!farmId) return;
    try {
<<<<<<< HEAD
      const res = await axios.get(`${BASE_URL}/adminfarms/${farmId}`, getOpts());
      const data = res.data;
      setForm({
        ...data,
        tags: (data.tags || []).join(", "),
        services: data.services || [],
        features: data.features || [],
        ownerInfo: { name: data.ownerInfo?.name || "" },
        status: data.status || "pending",
      });
    } catch (err) {
      setError("Không thể tải dữ liệu.");
    }
  };

  useEffect(() => {
    if (open && farmId) fetchFarm();
    if (open && !farmId) {
      setForm({
        name: "",
        code: "",
        tags: "",
        province: "",
        district: "",
        ward: "",
        street: "",
        location: "",
        area: "",
        cultivatedArea: "",
        phone: "",
        zalo: "",
        description: "",
        services: [],
        features: [],
        ownerInfo: { name: "" },
        status: "pending",
      });
      setError("");
=======
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
>>>>>>> 207daaf3f9a46e0d104a69f82ceba181d1c7a837
    }
  }, [open, farmId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

<<<<<<< HEAD
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        ...form,
        tags: form.tags.split(",").map((t) => t.trim()),
      };

      if (farmId) {
        await axios.put(`${BASE_URL}/adminfarms/${farmId}`, payload, getOpts());
      } else {
        await axios.post(`${BASE_URL}/adminfarms`, payload, getOpts());
      }

      if (onSubmitSuccess) onSubmitSuccess();
      onClose();
    } catch (err) {
      setError("Lỗi lưu dữ liệu: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} handler={onClose} size="xl">
      <DialogHeader className="flex justify-between items-center">
        <Typography variant="h5">
          {farmId ? "Chỉnh sửa nông trại" : "Tạo mới nông trại"}
        </Typography>
        <IconButton variant="text" onClick={onClose}>
          <XMarkIcon className="h-5 w-5" />
        </IconButton>
      </DialogHeader>

      <DialogBody className="max-h-[80vh] overflow-y-auto px-6 space-y-4">
        {error && <Typography color="red">{error}</Typography>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Tên nông trại" name="name" value={form.name} onChange={handleChange} />
          <Input label="Mã nông trại" name="code" value={form.code} onChange={handleChange} />
          <Input label="Tags (phân cách bằng dấu phẩy)" name="tags" value={form.tags} onChange={handleChange} />

          <MTSelect
            label="Trạng thái"
            value={form.status}
            onChange={(val) => setForm((prev) => ({ ...prev, status: val }))}
          >
            <Option value="active">Đang hoạt động</Option>
            <Option value="inactive">Ngưng hoạt động</Option>
            <Option value="pending">Chờ xác nhận</Option>
          </MTSelect>

          <Input label="Tỉnh/Thành phố" name="province" value={form.province} onChange={handleChange} />
          <Input label="Quận/Huyện" name="district" value={form.district} onChange={handleChange} />
          <Input label="Phường/Xã" name="ward" value={form.ward} onChange={handleChange} />
          <Input label="Đường" name="street" value={form.street} onChange={handleChange} />
          <Input label="Vị trí tổng quát" name="location" value={form.location} onChange={handleChange} />
          <Input label="Tổng diện tích (m²)" name="area" value={form.area} onChange={handleChange} />
          <Input label="Đất canh tác (m²)" name="cultivatedArea" value={form.cultivatedArea} onChange={handleChange} />
          <Input label="Số điện thoại" name="phone" value={form.phone} onChange={handleChange} />
          <Input label="Zalo" name="zalo" value={form.zalo} onChange={handleChange} />
          <Input
            label="Chủ sở hữu"
            name="ownerInfo.name"
            value={form.ownerInfo.name}
            onChange={(e) => {
              const value = e.target.value;
              setForm((prev) => ({
                ...prev,
                ownerInfo: { ...prev.ownerInfo, name: value },
              }));
            }}
          />
        </div>

        {/* Dịch vụ và tính năng chọn nhiều */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Dịch vụ</label>
            <Select
              isMulti
              options={serviceOptions}
              value={serviceOptions.filter((opt) => form.services.includes(opt.value))}
              onChange={(selected) =>
                setForm((prev) => ({
                  ...prev,
                  services: selected.map((s) => s.value),
                }))
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Tính năng</label>
            <Select
              isMulti
              options={featureOptions}
              value={featureOptions.filter((opt) => form.features.includes(opt.value))}
              onChange={(selected) =>
                setForm((prev) => ({
                  ...prev,
                  features: selected.map((f) => f.value),
                }))
              }
            />
          </div>
        </div>

        <Textarea
          label="Mô tả"
          name="description"
          value={form.description}
          onChange={handleChange}
        />
      </DialogBody>

      <DialogFooter className="space-x-2">
        <Button variant="text" onClick={onClose}>Đóng</Button>
        <Button color="blue" onClick={handleSubmit} loading={loading}>
          {farmId ? "Cập nhật" : "Tạo mới"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

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
>>>>>>> 207daaf3f9a46e0d104a69f82ceba181d1c7a837
