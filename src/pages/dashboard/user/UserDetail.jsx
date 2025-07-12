import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardBody, Typography, Spinner,Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import FarmForm from "./FarmForm";

export default function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [farms, setFarms] = useState([]);       
  const [videos, setVideos] = useState([]);     
  const [posts, setPosts] = useState([]); 
  const [openFarmForm, setOpenFarmForm] = useState(false); 

  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Không tìm thấy access token!");
      setLoading(false);
      return;
    }

    const fetchUserDetails = async () => {
      try {
        
        const userRes = await axios.get(`https://api-ndolv2.nongdanonline.cc/admin-users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(userRes.data);

        
        const farmRes = await axios.get(`https://api-ndolv2.nongdanonline.cc/adminfarms`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const farmsData = Array.isArray(farmRes.data) ? farmRes.data.filter(farm => farm.ownerId === id) : [];
        setFarms(farmsData);

        
        const videoRes = await axios.get(`https://api-ndolv2.nongdanonline.cc/admin-video-farm`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const videosData = Array.isArray(videoRes.data) ? videoRes.data.filter(video => video.uploadedBy?.id === id) : [];
        setVideos(videosData);

        
        const postRes = await axios.get(`https://api-ndolv2.nongdanonline.cc/admin-post-feed`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const postsData = Array.isArray(postRes.data.data) ? postRes.data.data.filter(post => post.authorId === id) : [];
        setPosts(postsData);

      } catch (err) {
        console.error(err);
        setError("Không thể tải chi tiết người dùng.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [id]);

  const handleCreateFarm = async (farmData) => {
  const token = localStorage.getItem("token");
  try {

    await axios.post(`https://api-ndolv2.nongdanonline.cc/adminfarms`, farmData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert("Tạo nông trại thành công!");
    setOpenFarmForm(false);

    const updatedFarms = await axios.get(`https://api-ndolv2.nongdanonline.cc/adminfarms`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const farmsData = Array.isArray(updatedFarms.data)
      ? updatedFarms.data.filter(farm => farm.ownerId === id)
      : [];
    setFarms(farmsData);
  } catch (err) {
    console.error(err);
    alert("Tạo nông trại thất bại!");
  }
};

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <Spinner className="h-12 w-12" color="blue" />
    </div>
  );

  if (error) return (
    <Typography color="red" className="text-center mt-8">{error}</Typography>
  );

  if (!user) return <Typography className="text-center mt-8">Không có dữ liệu người dùng.</Typography>;

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <Button
        color="blue"
        size="sm"
        className="mb-4"
        onClick={() => navigate(-1)}
      >
        Quay lại
      </Button>
      <Card>
        <CardHeader floated={false} className="h-80">
          {user.avatar ? (
            <img
              src={`https://api-ndolv2.nongdanonline.cc${user.avatar}`}
              alt={user.fullName}
              className="h-full w-full object-cover rounded"
            />
          ) : (
            <div className="h-full w-full bg-gray-300 flex items-center justify-center text-gray-500">
              No Avatar
            </div>
          )}
        </CardHeader>
        <CardBody>
          <CardBody className="space-y-2">
          <Typography variant="h4" color="blue-gray">{user.fullName}</Typography>
          <Typography>Email: {user.email}</Typography>
          <Typography>Phone: {user.phone || "N/A"}</Typography>
          <Typography>Roles: {Array.isArray(user.role) ? user.role.join(", ") : user.role}</Typography>
          <Typography>Status: {user.isActive ? (
            <span className="text-green-600 font-bold">Active</span>
          ) : (
            <span className="text-gray-500 font-bold">Inactive</span>
          )}</Typography>
          <Typography>Note: {user.note || "N/A"}</Typography>
          <Typography>Created At: {new Date(user.createdAt).toLocaleString()}</Typography>
          <Typography>Last Login: {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "N/A"}</Typography>
        </CardBody>
        </CardBody>
      </Card>

      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <Typography variant="h5">Danh sách Nông Trại ({farms.length})</Typography>
          {/* 🆕 Nút thêm nông trại */}
          {/* <Button
            size="sm"
            color="green"
            onClick={() => setOpenFarmForm(true)}
          >
            + Thêm Nông Trại
          </Button> */}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Tên Farm</th>
                <th className="p-2 text-left">Ngày tạo</th>
              </tr>
            </thead>
            <tbody>
              {farms.map(farm => (
                <tr key={farm.id} className="border-t">
                  <td className="p-2">{farm.name}</td>
                  <td className="p-2">{farm.address}</td>
                  <td className="p-2">{new Date(farm.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      
      <div className="mt-6">
        <Typography variant="h5" className="mb-2">Danh sách Video ({videos.length})</Typography>
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Tiêu đề</th>
                <th className="p-2 text-left">Ngày đăng</th>
              </tr>
            </thead>
            <tbody>
              {videos.map(video => (
                <tr key={video.id} className="border-t">
                  <td className="p-2">{video.title}</td>
                  <td className="p-2">{new Date(video.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      
      <div className="mt-6">
        <Typography variant="h5" className="mb-2">Danh sách Bài Post ({posts.length})</Typography>
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Tiêu đề</th>
                <th className="p-2 text-left">Ngày tạo</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.id} className="border-t">
                  <td className="p-2">{post.title}</td>
                  <td className="p-2">{new Date(post.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* <FarmForm
        open={openFarmForm}
        onClose={() => setOpenFarmForm(false)}
        initialData={{ ownerId: id }} 
        onSubmit={handleCreateFarm}
      /> */}

    </div>
  );
}
