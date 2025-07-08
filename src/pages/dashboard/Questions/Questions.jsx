import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BaseUrl } from '@/ipconfig';
import { Oval } from 'react-loader-spinner';
import AddQuestion from "./AddQuestion"
import EditQuestion from './EditQuestion';
export const Questions = () => {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editData, setEditData] = useState(null);
  const [editValue, setEditValue] = useState({ options: [] });

  const [addDialog, setAddDialog] = useState(false);
  const [addValue, setAddValue] = useState({ text: '', options: [''], type: 'option', link: '' });

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
    if (
      ['option', 'single-choice', 'multiple-choice', 'multi-choice'].includes(editData.type) &&
      Array.isArray(editValue.options) &&
      editValue.options.some(opt => !opt || opt.trim() === '')
    ) {
      alert('Vui lòng điền đầy đủ tất cả các đáp án!');
      return;
    } else if (!editValue.text || editValue.text.trim() === '') {
      alert('Vui lòng nhập nội dung câu hỏi!');
      return;
    }
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

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa câu hỏi này?')) return;
    try {
      await axios.delete(`${BaseUrl}/admin-questions/${id}`, {
        headers: { Authorization: `Bearer ${tokenUser}` },
      });
      alert('Xóa thành công!');
      getData();
    } catch (error) {
      alert('Lỗi khi xóa!');
      console.log('Lỗi khi xóa:', error);
    }
  };

  const handleOpenAddDialog = () => {
    setAddValue({ text: '', options: [''], type: 'option', link: '' });
    setAddDialog(true);
  };
  const handleCloseAddDialog = () => {
    setAddDialog(false);
    setAddValue({ text: '', options: [''], type: 'option', link: '' });
  };
  const handleAddChange = (e, idx) => {
    if (["option", "single-choice", "multiple-choice", "multi-choice"].includes(addValue.type) && typeof idx === "number") {
      const newOptions = [...addValue.options];
      newOptions[idx] = e.target.value;
      setAddValue({ ...addValue, options: newOptions });
    } else {
      setAddValue({ ...addValue, [e.target.name]: e.target.value });
    }
  };
  const handleAddSave = async () => {
    if (!addValue.text || addValue.text.trim() === '') {
      alert('Vui lòng nhập nội dung câu hỏi!');
      return;
    }
    if (["option", "single-choice", "multiple-choice", "multi-choice"].includes(addValue.type) && addValue.options.some(opt => !opt || opt.trim() === '')) {
      alert('Vui lòng điền đầy đủ tất cả các đáp án!');
      return;
    }
   

    try {
      await axios.post(`${BaseUrl}/admin-questions`, addValue, {
        headers: { Authorization: `Bearer ${tokenUser}` },
      });
      alert('Thêm thành công!');
      handleCloseAddDialog();
      getData();
    } catch (error) {
      alert('Lỗi khi thêm!');
      console.log('Lỗi khi thêm:', error);
    }
  };
  return (
    <div>
      <div className="flex justify-end mb-4">
     <AddQuestion handleAddChange={handleAddChange} 
handleAddSave={handleAddSave} 
handleCloseAddDialog={handleCloseAddDialog} 
handleOpenAddDialog={handleOpenAddDialog} 
addDialog={addDialog}
addValue={addValue}
setAddValue={setAddValue}
/>
      </div>
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
                  onClick={() => handleDelete(item._id)}
                >
                  Xóa
                </button>
              </div>
            </div>
            <div className="flex gap-4 mt-8">
  {[ "single-choice", "multiple-choice", "multi-choice"].includes(item.type) && Array.isArray(item.options) && item.options.length > 0 ? (
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
  ) : item.type === 'text' ? (
    <input
      type="text"
      className="border px-3 py-2 rounded w-full max-w-xs"
      placeholder="Nhập câu trả lời..."
      disabled
    />
  ) : null}
</div>
          </div>
        ))
)}
<EditQuestion
setEditValue={setEditValue}
editData={editData}
editValue={editValue}
handleCloseDialog={handleCloseDialog}
handleEditChange={handleEditChange}
handleSave={handleSave}
openDialog={openDialog}
/>  
    </div>
  );
};

export default Questions;
