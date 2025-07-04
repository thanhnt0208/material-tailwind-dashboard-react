import React from "react";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { BaseUrl } from "@/ipconfig";
export function FarmDetail(){
      const { id } = useParams();
        const tokenUser= localStorage.getItem("token")
      const [product, setProduct] = useState<any>(null)
const getDetail=async()=>{
try {
const res= await axios(`${BaseUrl}/adminfarms/${id}`
,{  headers: {
    Authorization: `Bearer ${tokenUser}`, }
  },
)
if(res.status===200){
  setProduct(res.data)
}    } catch (error) {
        console.log("Lỗi server",error)
    }
}
useEffect(()=>{
getDetail()
},[])
console.log("data nè :",product)
return (
  <div>
    {product ? (
      <div>
        <span>{product.location}</span>
        {/* Hiển thị các thông tin khác nếu cần */}
      </div>
    ) : (
      <div>
        <span>Không có data</span>
      </div>
    )}
  </div>
)

}

export default FarmDetail