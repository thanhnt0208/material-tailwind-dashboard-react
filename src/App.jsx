import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";

function App() {
  return (
    <Routes>
      {/* Dashboard layout xử lý toàn bộ các route dashboard */}
      <Route path="/dashboard/*" element={<Dashboard />} />

      {/* Auth layout: đăng nhập, đăng ký */}
      <Route path="/auth/*" element={<Auth />} />

      {/* Redirect fallback */}
      <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
    </Routes>
  );
}

export default App;
