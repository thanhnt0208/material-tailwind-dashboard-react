import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import VideoFarmById from "./pages/dashboard/VideoFarms/VideoFarmById";
import CommentPostbyId from "./pages/dashboard/AdminCommentPost/CommentPostbyId";
import CommentPostbyIdPost from "./pages/dashboard/AdminCommentPost/CommentPostbyIdPost";
import CommentPostByIdUser from "./pages/dashboard/AdminCommentPost/CommentPostByIdUser";
function App() {
  return (
    <Routes>
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/auth/*" element={<Auth />} />
     <Route path="/dashboard/VideoFarmById/:farmId" element={<VideoFarmById />} />
      <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
      <Route path="/dashboard/CommentPostbyId/:id" element={<CommentPostbyId />} />
      <Route path="/dashboard/CommentPostbyIdPost/:postId" element={<CommentPostbyIdPost />} />
      <Route path="/dashboard/CommentPostByIdUser/:id" element={<CommentPostByIdUser />} />

    </Routes>
  );
}
 
export default App;
