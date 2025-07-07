import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";

const API_URL = "https://api-ndolv2.nongdanonline.vn/answers";
const token = localStorage.getItem("accessToken");

const AnswersTable = () => {
  const [answers, setAnswers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [form, setForm] = useState({
    farmId: "",
    questionId: "",
    selectedOptions: [],
    otherText: "",
    uploadedFiles: [],
  });

  const fetchAnswers = async () => {
    try {
      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAnswers(data);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu:", err);
    }
  };

  useEffect(() => {
    fetchAnswers();
  }, []);

  const openForm = (data = null) => {
    if (data) {
      setForm({
        farmId: data.farmId || "",
        questionId: data.questionId || "",
        selectedOptions: data.selectedOptions || [],
        otherText: data.otherText || "",
        uploadedFiles: data.uploadedFiles || [],
      });
      setEditData(data);
    } else {
      setForm({
        farmId: "",
        questionId: "",
        selectedOptions: [],
        otherText: "",
        uploadedFiles: [],
      });
      setEditData(null);
    }
    setOpen(true);
  };

  const handleSubmit = async () => {
    const url = editData ? `${API_URL}/${editData._id}` : API_URL;
    const method = editData ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Không thể lưu dữ liệu");
      setOpen(false);
      setEditData(null);
      fetchAnswers();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Không thể xoá dữ liệu");
      fetchAnswers();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h5">Danh sách câu trả lời</Typography>
        <Button color="green" onClick={() => openForm()}>
          Thêm mới
        </Button>
      </div>

      <table className="min-w-full bg-white border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">#</th>
            <th className="border px-4 py-2">Farm ID</th>
            <th className="border px-4 py-2">Question ID</th>
            <th className="border px-4 py-2">Đáp án chọn</th>
            <th className="border px-4 py-2">Khác</th>
            <th className="border px-4 py-2">Tệp đính kèm</th>
            <th className="border px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {answers.map((item, index) => (
            <tr key={item._id}>
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">{item.farmId}</td>
              <td className="border px-4 py-2">{item.questionId}</td>
              <td className="border px-4 py-2">
                {item.selectedOptions?.filter(Boolean).join(", ") || "—"}
              </td>
              <td className="border px-4 py-2">{item.otherText || "—"}</td>
              <td className="border px-4 py-2">
                {item.uploadedFiles?.length > 0
                  ? item.uploadedFiles.map((file, i) => (
                      <a
                        key={i}
                        href={file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline block"
                      >
                        File {i + 1}
                      </a>
                    ))
                  : "—"}
              </td>
              <td className="border px-4 py-2">
                <Button size="sm" onClick={() => openForm(item)}>
                  Sửa
                </Button>
                <Button
                  size="sm"
                  color="red"
                  onClick={() => handleDelete(item._id)}
                  className="ml-2"
                >
                  Xoá
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Dialog open={open} handler={() => setOpen(!open)}>
        <DialogHeader>{editData ? "Chỉnh sửa" : "Thêm mới"} câu trả lời</DialogHeader>
        <DialogBody>
          <Input
            label="Farm ID"
            value={form.farmId}
            onChange={(e) => setForm({ ...form, farmId: e.target.value })}
            className="mb-4"
          />
          <Input
            label="Question ID"
            value={form.questionId}
            onChange={(e) => setForm({ ...form, questionId: e.target.value })}
            className="mb-4"
          />
          <Input
            label="Selected Options (ngăn cách bởi dấu phẩy)"
            value={form.selectedOptions.join(", ")}
            onChange={(e) =>
              setForm({
                ...form,
                selectedOptions: e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
            className="mb-4"
          />
          <Input
            label="Other Text"
            value={form.otherText}
            onChange={(e) => setForm({ ...form, otherText: e.target.value })}
            className="mb-4"
          />
        </DialogBody>
        <DialogFooter>
          <Button variant="text" onClick={() => setOpen(false)} className="mr-2">
            Huỷ
          </Button>
          <Button color="blue" onClick={handleSubmit}>
            {editData ? "Cập nhật" : "Tạo mới"}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default AnswersTable;
