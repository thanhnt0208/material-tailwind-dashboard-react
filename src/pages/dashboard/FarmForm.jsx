import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Button,
} from "@material-tailwind/react";

const FarmForm = ({ open, onClose, initialData, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    location: "",
    area: "",
    pricePerMonth: "",
    status: "pending",
    ownerName: "",
    ownerPhone: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        code: initialData.code || "",
        location: initialData.location || "",
        area: initialData.area?.toString() || "",
        pricePerMonth: initialData.pricePerMonth?.toString() || "",
        status: initialData.status || "pending",
        ownerName: initialData.ownerInfo?.name || "",
        ownerPhone: initialData.ownerInfo?.phone || "",
      });
    } else {
      setFormData({
        name: "",
        code: "",
        location: "",
        area: "",
        pricePerMonth: "",
        status: "pending",
        ownerName: "",
        ownerPhone: "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.code) {
      return alert("Vui lòng nhập đầy đủ thông tin.");
    }

    const parsedData = {
      name: formData.name,
      code: formData.code,
      location: formData.location,
      area: formData.area === "" ? 0 : parseFloat(formData.area),
      pricePerMonth:
        formData.pricePerMonth === "" ? 0 : parseFloat(formData.pricePerMonth),
      status: formData.status || "pending",

      ownerInfo: {
        name: formData.ownerName || "Chưa rõ",
        phone: formData.ownerPhone || "",
        email: "", // Optional, bạn có thể thêm input nếu muốn
      },
      coordinates: {
        lat: 0,
        lng: 0,
      },
      features: [],
      phone: "",
      zalo: "",
      operationTime: "",
      defaultImage: "",
      services: [],
    };

    console.log("parsedData gửi về:", parsedData);

    onSubmit(parsedData);
    onClose();
  };

  return (
    <Dialog open={open} handler={onClose}>
      <DialogHeader>{initialData ? "Chỉnh sửa" : "Thêm"} nông trại</DialogHeader>
      <DialogBody className="flex flex-col gap-4">
        <Input label="Tên nông trại" name="name" value={formData.name} onChange={handleChange} />
        <Input label="Mã" name="code" value={formData.code} onChange={handleChange} />
        <Input label="Chủ sở hữu" name="ownerName" value={formData.ownerName} onChange={handleChange} />
        <Input label="Số điện thoại" name="ownerPhone" value={formData.ownerPhone} onChange={handleChange} />
        <Input label="Địa chỉ" name="location" value={formData.location} onChange={handleChange} />
        <Input label="Diện tích (m²)" name="area" type="number" value={formData.area} onChange={handleChange} />
        <Input label="Giá mỗi tháng (VNĐ)" name="pricePerMonth" type="number" value={formData.pricePerMonth} onChange={handleChange} />
      </DialogBody>
      <DialogFooter>
        <Button variant="text" onClick={onClose}>Huỷ</Button>
        <Button color="indigo" onClick={handleSubmit}>
          {initialData ? "Lưu" : "Thêm"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default FarmForm