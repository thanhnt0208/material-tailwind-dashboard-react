import React, { useEffect, useState } from "react";

const AnswersTable = () => {
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("https://api-ndolv2.nongdanonline.vn/answers")
      .then((res) => res.json())
      .then((data) => {
        setAnswers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center text-blue-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Danh sách câu trả lời</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2 border">#</th>
              <th className="text-left px-4 py-2 border">Câu hỏi</th>
              <th className="text-left px-4 py-2 border">Câu trả lời</th>
              <th className="text-left px-4 py-2 border">Ngày tạo</th>
            </tr>
          </thead>
          <tbody>
            {answers.map((item, index) => (
              <tr key={item._id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{index + 1}</td>
                <td className="px-4 py-2 border">{item.question}</td>
                <td className="px-4 py-2 border">{item.answer}</td>
                <td className="px-4 py-2 border">
                  {new Date(item.createdAt).toLocaleString("vi-VN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnswersTable
