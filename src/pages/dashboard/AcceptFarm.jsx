import React, { useEffect } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { Requiment } from "@/data/Farm-data";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BaseUrl } from "@/ipconfig";
export function AcceptFarm() {
    const navigate = useNavigate();
  const [farm,setFarm]=useState([])
  const AcceptFarm = async (id) => {
    setFarm((prev) => prev.filter((item) => item.id !== id));
  };
  const tokenUser= localStorage.getItem("token")
const getFarm =async ()=>{
try {
const res= await axios.get(`${BaseUrl}/adminfarms`,{  headers: {
    Authorization: `Bearer ${tokenUser}`, }
  
  },)
if(res.status===200){
setFarm(res.data)
}else{
console.log("Có lỗi khi lấy data ")
}
} catch (error) {
  console.log("Lỗi server :",error)
}
}

const getDetailFarm =async(id)=>{
navigate(`/FarmDetail/${id}`)
}
useEffect(()=>{
  getFarm()
},[])
  return (
    <div className="mx-auto my-20 flex flex-col items-center gap-8 w-full min-h-[60vh]">
      <div className="flex flex-col gap-6 w-full max-w-2xl">
        {farm.length === 0 ? (
          <div className="text-center text-2xl text-gray-400 font-semibold py-16">Không có đơn!</div>
        ) : (
          farm.map((item) => (
            <div
              onClick={() => getDetailFarm(item.id)}
              className="border rounded-2xl shadow-lg p-6 flex flex-col md:flex-row items-center gap-6 bg-white transition hover:shadow-2xl cursor-pointer"
              key={item.id}
            >
              <img
                className="rounded-xl w-40 h-32 object-cover border border-gray-200 bg-gray-50"
                src="https://snnptnt.binhdinh.gov.vn/assets/news//upload/files/cho-ca-an.jpg"
                alt={item.name}
              />
              <div className="flex-1 flex flex-col gap-2 w-full">
                <span className="font-bold text-xl text-gray-800">{item.name}</span>
                <span className="text-gray-600">Vị trí: <span className="font-medium">{item.location}</span></span>
                <span className="text-orange-600 font-semibold">{item.pricePerMonth} Vnđ</span>
                <span className="text-gray-500">Mã số: <span className="italic">{item.code}</span></span>
              </div>
              <div onClick={e => e.stopPropagation()}>
                <button
                  onClick={() => AcceptFarm(item.id)}
                  className="font-mono text-lg font-bold w-28 h-12 bg-lime-600 hover:bg-lime-700 text-white rounded-lg shadow transition m-auto md:m-0"
                >
                  Duyệt
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AcceptFarm;
