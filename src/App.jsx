import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import FarmDetail from "./pages/dashboard/FarmDetail";
import UpdateQuestion from "./pages/dashboard/Questions/UpdateQuestion";
function App() {
  return (
    <Routes>
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/auth/*" element={<Auth />} />
     <Route path="/FarmDetail/:id" element={<FarmDetail />} />
<Route path="/UpdateQuestion/:id" element={<UpdateQuestion />} />
  <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
    </Routes>
  );
}
 
export default App;
