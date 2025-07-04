import React, { useState, useEffect } from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Input, Button } from "@material-tailwind/react";

const FarmForm = ({ open, onClose, initialData, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    location: "",
    area: "",
    pricePerMonth: 0,
    status: "pending",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        area: initialData.area || "",
        pricePerMonth: initialData.pricePerMonth || 0,
      });
    } else {
      setFormData({
        name: "",
        code: "",
        location: "",
        area: "",
        pricePerMonth: 0,
        status: "pending",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "area" || name === "pricePerMonth" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.code) return alert("Vui lòng nhập đầy đủ thông tin.");
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={open} handler={onClose}>
      <DialogHeader>{initialData ? "Chỉnh sửa" : "Thêm"} nông trại</DialogHeader>
      <DialogBody className="flex flex-col gap-4">
        <Input label="Tên nông trại" name="name" value={formData.name} onChange={handleChange} />
        <Input label="Mã" name="code" value={formData.code} onChange={handleChange} />
        <Input label="Địa chỉ" name="location" value={formData.location} onChange={handleChange} />
        <Input label="Diện tích (m²)" name="area" type="number" value={formData.area} onChange={handleChange} />
        <Input label="Giá mỗi tháng (VNĐ)" name="pricePerMonth" type="number" value={formData.pricePerMonth} onChange={handleChange} />
      </DialogBody>
      <DialogFooter>
        <Button variant="text" onClick={onClose}>Huỷ</Button>
        <Button color="indigo" onClick={handleSubmit}>{initialData ? "Lưu" : "Thêm"}</Button>
      </DialogFooter>
    </Dialog>
  );
};

export default FarmForm;
