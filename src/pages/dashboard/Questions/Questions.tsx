import React, { useEffect } from 'react'
import axios from 'axios'
import { useState } from 'react'
import { BaseUrl } from '@/ipconfig'
import { useNavigate } from 'react-router-dom'
import { Oval } from 'react-loader-spinner';

export const Questions = () => {
  const [loading, setLoading] = useState(true);
  const tokenUser= localStorage.getItem("token")
  const [questions,setQuestions]=useState([])
  const navigate=useNavigate()
  const getData=async()=>{
try {
const res= await axios.get(`${BaseUrl}/admin-questions`,{
  headers:{Authorization:`Bearer ${tokenUser}` }
})

if(res.status===200){
setQuestions(res.data)
setLoading(false)
}
console.log("Có lỗi trong lúc lấy data")
} catch (error) {
  console.log("Lỗi nè: ",error)
}

}

const gotoUpdate =async(id)=>{
navigate(`/UpdateQuestion/${id}`)
}
console.log(questions)
useEffect(()=>{
getData()
},[])
  return (
    <div>
      {
        loading ?
        (   <Oval
          height={80}
          width={80}
          color="blue"
          visible={true}
          ariaLabel='oval-loading'
          secondaryColor="lightblue"
          strokeWidth={2}
          strokeWidthSecondary={2}
        />):(
        questions.map((item) => (
          <div key={item.id} className="mb-6 p-4 border rounded-lg bg-white shadow ">
       <div className='flex justify-between'>
            <div className="font-semibold mb-2">{item.text}</div>
             <div className="flex gap-2">
              <button
                className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded shadow text-sm"
                onClick={() => gotoUpdate(item._id)}
              >
                Cập nhật
              </button>
              <button
                className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded shadow text-sm"
                onClick={() => {/* TODO: handle delete */}}
              >
                Xóa
              </button>
            </div>
       </div>
            <div className="flex gap-4 mt-8">
              {Array.isArray(item.options) && item.options.length > 0 ? (
                item.options.map((opt: string, idx: number) => (
                  <button
                    key={idx}
                    className="px-4 py-2 bg-blue-400 hover:bg-blue-600 text-white rounded"
                  >
                    {opt}
                  </button>
                ))
              ) : item.type === "image" ? (
                <input
                  type="file"
                  accept="image/*"
                  className="border px-3 py-2 rounded w-full max-w-xs"
                />
              ) : item.type === "link" ? (
                <input
                  type="url"
                  className="border px-3 py-2 rounded w-full max-w-xs"
                  placeholder="Nhập đường dẫn..."
                />
              ) : (
                <input
                  type="text"
                  className="border px-3 py-2 rounded w-full max-w-xs"
                  placeholder="Nhập câu trả lời..."
                />
              )}
            </div>
          </div>
        ))
      )
      }
    </div>
  )
}

export default Questions