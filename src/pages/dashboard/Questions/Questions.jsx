import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BaseUrl } from '@/ipconfig';
import { Oval } from 'react-loader-spinner';

export const Questions = () => {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editData, setEditData] = useState(null);
  const [editValue, setEditValue] = useState({ options: [] });

  const tokenUser = localStorage.getItem('token');

  const getData = async () => {
    try {
      const res = await axios.get(`${BaseUrl}/admin-questions`, {
        headers: { Authorization: `Bearer ${tokenUser}` },
      });
      if (res.status === 200) {
        setQuestions(res.data);
      }
    } catch (error) {
      console.log('Lỗi nè:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleOpenDialog = (item) => {
    setEditData(item);
    setEditValue({
      text: item.text,
      options: Array.isArray(item.options) ? [...item.options] : [],
      type: item.type,
      link: item.link || '',
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditData(null);
    setEditValue({ options: [] });
  };

  const handleEditChange = (e, idx) => {
    if (
      editData &&
      ['option', 'single-choice', 'multiple-choice', 'multi-choice'].includes(editData.type) &&
      typeof idx === 'number'
    ) {
      const newOptions = [...editValue.options];
      newOptions[idx] = e.target.value;
      setEditValue({ ...editValue, options: newOptions });
    } else {
      setEditValue({ ...editValue, [e.target.name]: e.target.value });
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `${BaseUrl}/admin-questions/${editData._id}`,
        editValue,
        {
          headers: { Authorization: `Bearer ${tokenUser}` },
        }
      );
      alert("Lưu thành công")
      handleCloseDialog();
      getData();
    } catch (error) {
      console.log('Lỗi khi cập nhật:', error);
    }
  };

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Oval
            height={80}
            width={80}
            color="blue"
            visible={true}
            ariaLabel="oval-loading"
            secondaryColor="lightblue"
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
        </div>
      ) : questions.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">
          Không có câu hỏi nào.
        </div>
      ) : (
        questions.map((item) => (
          <div
            key={item._id}
            className="mb-6 p-4 border rounded-lg bg-white shadow"
          >
            <div className="flex justify-between">
              <div className="font-semibold mb-2">{item.text}</div>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded shadow text-sm"
                  onClick={() => handleOpenDialog(item)}
                >
                  Cập nhật
                </button>
                <button
                  className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded shadow text-sm"
                  onClick={() => {
                  }}
                >
                  Xóa
                </button>
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              {Array.isArray(item.options) && item.options.length > 0 ? (
                item.options.map((opt, idx) => (
                  <button
                    key={idx}
                    className="px-4 py-2 bg-blue-400 hover:bg-blue-600 text-white rounded"
                  >
                    {opt}
                  </button>
                ))
              ) : item.type === 'upload' ? (
                <input
                  type="file"
                  accept="image/*"
                  className="border px-3 py-2 rounded w-full max-w-xs"
                  disabled
                />
              ) : item.type === 'link' ? (
                <input
                  type="url"
                  className="border px-3 py-2 rounded w-full max-w-xs"
                  placeholder="Nhập đường dẫn..."
                  disabled
                />
              ) : (
                <input
                  type="text"
                  className="border px-3 py-2 rounded w-full max-w-xs"
                  placeholder="Nhập câu trả lời..."
                  disabled
                />
              )}
            </div>
          </div>
        ))
      )}
      {openDialog && editData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 min-w-[350px] max-w-[90vw]">
            <div className="font-bold text-lg mb-4">Sửa câu hỏi</div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Nội dung câu hỏi
              </label>
              <input
                name="text"
                value={editValue.text}
                onChange={handleEditChange}
                className="border px-3 py-2 rounded w-full"
              />
            </div>
            {['option', 'single-choice', 'multi-choice'].includes(
              editData.type
            ) && Array.isArray(editValue.options) && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Tùy chọn đáp án
                </label>
                {editValue.options.length === 0 && (
                  <div className="text-gray-400 italic mb-2">
                    Chưa có đáp án nào, hãy thêm đáp án mới.
                  </div>
                )}
                {editValue.options.map((opt, idx) => (
                  <div key={idx} className="flex gap-2 mb-2 items-center">
                    <span className="w-6 text-gray-500 font-semibold">
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    <input
                      value={opt}
                      onChange={(e) => handleEditChange(e, idx)} 
                      className="border px-3 py-2 rounded w-full"
                      placeholder={`Đáp án ${String.fromCharCode(65 + idx)}`}
                    />
                    <button
                      type="button"
                      className="px-2 py-1 bg-red-400 text-white rounded hover:bg-red-600"
                      onClick={() => {
                        const newOptions = editValue.options.filter((_, i) => i !== idx);
                        setEditValue({ ...editValue, options: newOptions });
                      }}
                      disabled={editValue.options.length <= 1}
                      title={
                        editValue.options.length <= 1
                          ? 'Phải có ít nhất 1 đáp án'
                          : 'Xóa đáp án'
                      }
                    >
                      Xóa
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 mt-2"
                  onClick={() =>
                    setEditValue({
                      ...editValue,
                      options: [...editValue.options, ''],
                    })
                  }
                >
                  Thêm đáp án
                </button>
              </div>
            )}
            {editData.type === 'link' && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Link</label>
                <input
                  name="link"
                  value={editValue.link}
                  onChange={handleEditChange}
                  className="border px-3 py-2 rounded w-full"
                />
              </div>
            )}
            <div className="flex justify-end gap-2 mt-6">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={handleCloseDialog}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleSave}
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Questions;
