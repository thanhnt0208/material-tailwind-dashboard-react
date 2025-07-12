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

const API_URL = "https://api-ndolv2.nongdanonline.cc/answers";

// Hàm fetch có auto-refresh token
const fetchWithAuth = async (url, options = {}) => {
  let token = localStorage.getItem("token");

  let res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401 || res.status === 403) {
    console.warn("⚠ Token hết hạn, đang làm mới...");
    const refreshToken = localStorage.getItem("refreshToken");
    const refreshRes = await fetch("https://api-ndolv2.nongdanonline.cc/auth/refresh-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (refreshRes.ok) {
      const refreshData = await refreshRes.json();
      localStorage.setItem("token", refreshData.accessToken);
      token = refreshData.accessToken;

      // Gọi lại API với token mới
      res = await fetch(url, {
        ...options,
        headers: {
          ...(options.headers || {}),
          Authorization: `Bearer ${token}`,
        },
      });
    } else {
      console.error("❌ Refresh token thất bại");
      throw new Error("Vui lòng đăng nhập lại!");
    }
  }

  return res;
};

export function AnswersTable() {
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
  const [uploading, setUploading] = useState(false);

  const fetchAnswers = async () => {
    try {
      const res = await fetchWithAuth(API_URL);
      const data = await res.json();
      if (Array.isArray(data)) {
        setAnswers(data);
      } else {
        console.error("API không trả về danh sách");
        setAnswers([]);
      }
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
  if (!form.farmId || !form.questionId) {
    alert("Vui lòng nhập đủ Farm ID và Question ID");
    return;
  }

  const url = `${API_URL}/batch`; // luôn dùng /batch
  const method = "POST";

  const body = {
    farmId: form.farmId,
    answers: [
      {
        questionId: form.questionId,
        selectedOptions: form.selectedOptions,
        otherText: form.otherText,
        uploadedFiles: form.uploadedFiles,
      },
    ],
  };

  try {
    const res = await fetchWithAuth(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Error response:", errorData);
      throw new Error(errorData.message || "Không thể lưu dữ liệu");
    }

    setOpen(false);
    setEditData(null);
    fetchAnswers();
  } catch (err) {
    alert(`Lỗi: ${err.message}`);
  }
};

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá?")) return;
    try {
      const res = await fetchWithAuth(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Không thể xoá dữ liệu");
      fetchAnswers();
    } catch (err) {
      alert(err.message);
    }
  };

const handleUploadImage = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  setUploading(true);
  try {
    const res = await fetchWithAuth(`https://api-ndolv2.nongdanonline.cc/answers/upload-image`, {
  method: "POST",
  body: formData,
});
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await res.text();
      console.error("⚠️ Server không trả JSON:", text);
      throw new Error("Phản hồi không phải JSON");
    }

    const result = await res.json();

    if (!res.ok) {
      console.error("❌ Upload thất bại:", result);
      throw new Error(result.message || "Không thể upload hình ảnh");
    }
    setForm((prev) => ({
      ...prev,
      uploadedFiles: [...prev.uploadedFiles, result.path],
    }));
  } catch (err) {
    alert(`Upload lỗi: ${err.message}`);
  } finally {
    setUploading(false);
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
        <thead className="bg-blue-500 text-white">
          <tr>
            <th className="border px-2 py-2 w-12">#</th>
            <th className="border px-2 py-2 w-40">Farm ID</th>
            <th className="border px-2 py-2 w-40">Question ID</th>
            <th className="border px-2 py-2 w-[300px]">Đáp án chọn</th>
            <th className="border px-2 py-2 w-28">Khác</th>
            <th className="border px-2 py-2 w-[250px]">Tệp đính kèm</th>
            <th className="border px-2 py-2 w-40">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {answers.map((item, index) => (
            <tr key={item._id}>
              <td className="border px-2 py-2">{index + 1}</td>
              <td className="border px-2 py-2 truncate">{item.farmId}</td>
              <td className="border px-2 py-2 truncate">{item.questionId}</td>
              <td className="border px-2 py-2 whitespace-normal">
                {item.selectedOptions?.join(", ") || "—"}
              </td>
              <td className="border px-2 py-2 truncate">{item.otherText || "—"}</td>
              <td className="border px-2 py-2 whitespace-normal">
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
              <td className="border px-2 py-2">
                <div className="flex gap-2">
                  <Button size="sm" color="blue" onClick={() => openForm(item)}>
                    Sửa
                  </Button>
                  <Button
                    size="sm"
                    color="red"
                    onClick={() => handleDelete(item._id)}
                  >
                    Xoá
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Dialog form */}
      <Dialog open={open} handler={() => setOpen(!open)}>
        <DialogHeader>{editData ? "Chỉnh sửa" : "Thêm mới"} câu trả lời</DialogHeader>
        <DialogBody className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Farm ID</label>
            <Input
              value={form.farmId}
              onChange={(e) => setForm({ ...form, farmId: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Question ID</label>
            <Input
              value={form.questionId}
              onChange={(e) => setForm({ ...form, questionId: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Selected Options <span className="text-gray-500 text-xs">(ngăn cách dấu phẩy)</span>
            </label>
            <Input
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
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Other Text</label>
            <Input
              value={form.otherText}
              onChange={(e) => setForm({ ...form, otherText: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Upload file</label>
            <Input type="file" onChange={handleUploadImage} />
            {uploading && <span className="text-sm text-gray-500">Đang tải lên...</span>}
          </div>
        </DialogBody>
        <DialogFooter className="flex justify-end gap-3">
          <Button variant="outlined" color="gray" onClick={() => setOpen(false)}>
            Huỷ
          </Button>
          <Button color="blue" onClick={handleSubmit}>
            {editData ? "Cập nhật" : "Tạo mới"}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default AnswersTable;
