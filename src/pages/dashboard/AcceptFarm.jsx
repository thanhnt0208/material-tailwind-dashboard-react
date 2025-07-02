import React, { useEffect } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { Requiment } from "@/data/Farm-data";
import axios from "axios";
export function AcceptFarm() {
  const BaseUrl=`https://api-ndolv2.nongdanonline.vn`
  const [Accept, setAccept] = React.useState({});
  const [farm,setFarm]=useState([])
  const AcceptFarm = async (id) => {
    // setAccept((prev) => ({ ...prev, [id]: true }));
    setFarm((prev) => prev.filter((item) => item.id !== id));
  
  };
const getFarm =async ()=>{
try {
const res= await axios.get(`${BaseUrl}/farms`)
if(res.status===200){
setFarm(res.data)
}else{
console.log("Có lỗi khi lấy data ")
}
} catch (error) {
  console.log("Lỗi :",error)
}
}
useEffect(()=>{
  getFarm()
},[])
  return (
    <div className="mx-auto my-20 flex max-w-screen-lg flex-col gap-8">
      <div className="flex flex-col gap-4 p-4 ">

        {
         farm.length===0 ? (<div><text>Không có đơn ! </text></div>):( ( farm.map((item) =>  (
          
          <div className="border rounded-lg shadow p-4 flex flex-col gap-2 bg-white " key={item.id}>
            <span className="font-bold text-lg">{item.name}</span>
            <span>Vị trí: {item.location}</span>
            <span className="text-orange-600 font-semibold">{item.pricePerMonth} Vnđ</span>
           <span>Mã số:<span className="italic text-gray-500"> {item.code}</span></span> 
            {/* {
              item.farmImages ?(
            <img src={item.farmImages} className="w-full max-w-xs rounded mt-2" alt={item.nameFarm} />

              ):(
                <img src="https://snnptnt.binhdinh.gov.vn/assets/news//upload/files/cho-ca-an.jpg"/>
              )
            } */}
            <img className="rounded-lg " src="https://snnptnt.binhdinh.gov.vn/assets/news//upload/files/cho-ca-an.jpg"/>

            {!Accept[item.id] ? (
              <button
                onClick={() => AcceptFarm(item.id)}
                className="font-mono text-2xl  w-24 bg-lime-600 rounded-lg m-auto antialiased"
              >
                Duyệt
              </button>
            ) : (
              <button
                className="font-mono text-2xl  w-24 bg-orange-400 rounded-lg m-auto antialiased"
                disabled
              >
                Đã duyệt
              </button>
            )} 
          </div>))
           ))
       }
      
      </div>
    </div>
  );
}

export default AcceptFarm;
