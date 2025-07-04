import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { BaseUrl } from '@/ipconfig'
import { useState } from 'react'

 export const UpdateQuestion = () => {
   const tokenUser= localStorage.getItem("token")
    const [questionOptions,setQuestionOptions]=useState([])
    const [questionText,setQuestionText]=useState()
  const [questionDetail,setQuestionDetail]=useState()
    const {id}=useParams()

const getQuestionByid =async()=>{
try {
  const res= await axios.get(`${BaseUrl}/admin-questions/${id}`,{headers:{Authorization:`Bearer ${tokenUser}`}})
if(res.status===200){
  setQuestionText(res.data.text||"")
  setQuestionOptions(res.data.options||[])
}
console.log("Có lỗi khi lấy data")
} catch (error) {
  console.log("Lỗi nè:",error)
}

}

    const handleText=(item)=>{
   setQuestionText(item.target.value)
    }

const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // setQuestionText(e.target.value)
  }

console.log(questionDetail)
    useEffect(()=>{
getQuestionByid()
    },[])
  return (
    <div>
      <div className='flex' >
    <input className='flex w-400  ' value={questionText}  
    onChange={()=>handleTitleChange} 
    placeholder='Nhấn vào đây'/>
      </div>
  
    {
      questionOptions.map((item,index)=>(
    <input value={questionOptions} onChange={handleText} placeholder={`Option ${index + 1}`}/>

      ))
    }
    </div>
  )
}

export default UpdateQuestion