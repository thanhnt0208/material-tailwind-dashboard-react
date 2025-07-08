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
import Select from "react-select";

// Tùy chọn dịch vụ
const serviceOptions = [
  { value: "direct_selling", label: "Bán hàng trực tiếp" },
  { value: "feed_selling", label: "Bán thức ăn chăn nuôi" },
  { value: "custom_feed_blending", label: "Pha trộn thức ăn theo yêu cầu" },
  { value: "processing_service", label: "Dịch vụ chế biến" },
  { value: "storage_service", label: "Dịch vụ lưu trữ" },
  { value: "transport_service", label: "Dịch vụ vận chuyển" },
  { value: "other_services", label: "Dịch vụ khác" },
];

// Tùy chọn tính năng
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

// Tags
const tagOptions = [
  { value: "nông sản", label: "nông sản" },
  { value: "hữu cơ", label: "hữu cơ" },
  { value: "mùa vụ", label: "mùa vụ" },
];

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
    if (initialData) setForm(initialData);
  }, [initialData]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    onClose();
  };

  return (
    <Dialog open={open} handler={onClose} size="lg">
      <DialogHeader className="text-lg">{initialData ? "Chỉnh sửa" : "Thêm"} nông trại</DialogHeader>

      <DialogBody className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 px-4 text-sm">
        <Input label="Tên nông trại" value={form.name} onChange={(e) => handleChange("name", e.target.value)} />
        <Input label="Vị trí" value={form.location} onChange={(e) => handleChange("location", e.target.value)} />
        <Input label="Diện tích (m²)" type="number" value={form.area} onChange={(e) => handleChange("area", e.target.value)} />
        <Input label="Diện tích đất canh tác (m²)" type="number" value={form.cultivatedArea} onChange={(e) => handleChange("cultivatedArea", e.target.value)} />

        <div className="mb-1 md:col-span-2">
          <label className="block text-sm mb-1">Dịch vụ</label>
          <Select
            isMulti
            options={serviceOptions}
            classNamePrefix="select-sm"
            value={form.services.map(val => serviceOptions.find(opt => opt.value === val))}
            onChange={(selected) => handleArrayChange("services", selected.map(s => s.value))}
          />
        </div>

        <div className="mb-1 md:col-span-2">
          <label className="block text-sm mb-1">Tính năng</label>
          <Select
            isMulti
            options={featureOptions}
            classNamePrefix="select-sm"
            value={form.features.map(val => featureOptions.find(opt => opt.value === val))}
            onChange={(selected) => handleArrayChange("features", selected.map(s => s.value))}
          />
        </div>

        <div className="mb-1 md:col-span-2">
          <label className="block text-sm mb-1">Tags</label>
          <Select
            isMulti
            options={tagOptions}
            classNamePrefix="select-sm"
            value={form.tags.map((val) => ({ value: val, label: val }))}
            onChange={(selected) => handleArrayChange("tags", selected.map((s) => s.value))}
          />
        </div>

        <Input label="Số điện thoại" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} />
        <Input label="Zalo" value={form.zalo} onChange={(e) => handleChange("zalo", e.target.value)} />
        <Input label="Tỉnh/Thành phố" value={form.province} onChange={(e) => handleChange("province", e.target.value)} />
        <Input label="Quận/Huyện" value={form.district} onChange={(e) => handleChange("district", e.target.value)} />
        <Input label="Phường/Xã" value={form.ward} onChange={(e) => handleChange("ward", e.target.value)} />
        <Input label="Đường" value={form.street} onChange={(e) => handleChange("street", e.target.value)} />
        <Input label="ID Chủ sở hữu" value={form.ownerId} onChange={(e) => handleChange("ownerId", e.target.value)} />
        <Checkbox label="Farm đang sẵn sàng" checked={form.isAvailable} onChange={(e) => handleChange("isAvailable", e.target.checked)} />
      </DialogBody>

      <DialogFooter className="flex justify-end gap-2 px-4 py-3">
        <Button variant="text" onClick={onClose} className="px-4 py-1 text-sm">
          Huỷ
        </Button>
        <Button color="green" onClick={handleSubmit} className="px-4 py-1 text-sm">
          {initialData ? "Cập nhật" : "Thêm"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default FarmForm;
