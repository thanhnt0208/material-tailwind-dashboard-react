import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import VideoFarmById from "./pages/dashboard/VideoFarms/ListVideo";
import VideoLikeList from "./pages/dashboard/VideoFarms/VideoLikeList";
import PostDetail from "./pages/dashboard/post/PostDetail";
import CommentPostbyId from "./pages/dashboard/AdminCommentPost/CommentPostbyId";
import CommentPostbyIdPost from "./pages/dashboard/AdminCommentPost/CommentPostbyIdPost";
import CommentPostByIdUser from "./pages/dashboard/AdminCommentPost/CommentPostByIdUser";
import FarmDetail from "./pages/dashboard/farm/FarmDetail";
import { Farms } from "./pages/dashboard/farm/farms";
import VideoById from "./pages/dashboard/VideoFarms/VideoById";
import UserDetail from "./pages/dashboard/user/UserDetail";
function App() {
  const navigate = useNavigate();
  useEffect(() =>{
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth/sign-in")
    }
  })
  return (
    <Routes>
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/auth/*" element={<Auth />} />
      <Route path="/dashboard/VideoFarmById/:farmId" element={<VideoFarmById />} />
      <Route path="/dashboard/video-like/:videoId" element={<VideoLikeList />} />
      <Route path="/dashboard/post/:id" element={<PostDetail />} />
      <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
      <Route path="/dashboard/CommentPostbyId/:id" element={<CommentPostbyId />} />
      <Route path="/dashboard/CommentPostbyIdPost/:postId" element={<CommentPostbyIdPost />} />
      <Route path="/dashboard/CommentPostByIdUser/:id" element={<CommentPostByIdUser />} />
      <Route path="/admin/Farms" element={<Farms />} />
      <Route path="/admin/farms/:id" element={<FarmDetail />} />
      <Route path="/dashboard/VideoFarms/VideoById/:id" element={<VideoById />} />
      <Route path="/dashboard/users/:id" element={<UserDetail />} />

    </Routes>
  );
}
 
export default App;