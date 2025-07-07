import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Button,
  Checkbox,
} from "@material-tailwind/react";


const FarmForm = ({ open, onClose, initialData, onSubmit }) => {
  const [form, setForm] = useState({
    name: "",
    code: "",
    location: "",
    area: 0,
    cultivatedArea: 0,
    services: [],
    features: [],
    tags: [],
    phone: "",
    zalo: "",
    province: "",
    district: "",
    ward: "",
    street: "",
    isAvailable: true,
    status: "pending",
    ownerId: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value}));
  };

  const handleArrayChange = (filed, value) => {
    setForm((prev) => ({
      ... prev, [filed]:value.split(",").map((s) => s.trim()),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    onClose();

  }

  return (
    <Dialog open={open} handler={onClose} size="lg">
      <DialogHeader>{initialData ? "Chỉnh sửa" : "Thêm"} nông trại</DialogHeader>
      <DialogBody className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Mã" value={form.code} onChange={(e) => handleChange ("code", e.target.value)} />
        <Input label="Tên nông trại" value={form.name} onChange={(e) => handleChange ("name", e.target.value)} />
        <Input label="Vị trí" value={form.location} onChange={(e) => handleChange ("location", e.target.value)} />
        <Input label="Diện tích (m²)" type="number" value={form.area} onChange={(e) => handleChange ("area", e.target.value)} />
        <Input label="Diện tích đất canh tác (m²)" type="number" value={form.cultivatedArea} onChange={(e) => handleChange ("cultivatedArea", e.target.value)} />
        <Input label="Dịch vụ (cách nhau bằng dấu phẩy)" value={form.services.join(', ')} onChange={(e) => handleArrayChange ("services", e.target.value)} />
        <Input label="Tính năng (cách nhau bằng dấu phẩy)" value={form.features.join(', ')} onChange={(e) => handleArrayChange ("features", e.target.value)} />
        <Input label="Tags (cách nhau bằng dấu phẩy)" value={form.tags.join(', ')} onChange={(e) => handleArrayChange ("tags", e.target.value)} />
        <Input label="Số điện thoại" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} />
        <Input label="Zalo" value={form.zalo} onChange={(e) => handleChange('zalo', e.target.value)} />
        <Input label="Tỉnh/Thành phố" value={form.province} onChange={(e) => handleChange("province", e.target.value)} />
        <Input label="Quận/Huyện" value={form.district} onChange={(e) => handleChange("district", e.target.value)} />
        <Input label="Phường/Xã" value={form.ward} onChange={(e) => handleChange("ward", e.target.value)} />
        <Input label="Đường" value={form.street} onChange={(e) => handleChange("street", e.target.value)} />
        <Input label="ID Chủ sở hữu" value={form.ownerId} onChange={(e) => handleChange("ownerId", e.target.value)} />
        <Checkbox label="Farm đang sẵn sàng" checked={form.isAvailable} onChange={(e) => handleChange("isAvailable", e.target.checked)} />
      </DialogBody>
      <DialogFooter>
        <Button variant="text" onClick={onClose}>Huỷ</Button>
        <Button color="green" onClick={handleSubmit}>
          {initialData ? "Cập nhật" : "Thêm"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default FarmForm