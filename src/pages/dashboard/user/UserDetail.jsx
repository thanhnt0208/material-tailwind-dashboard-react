import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card, CardHeader, CardBody, Typography, Spinner, Collapse, Dialog, DialogBody, DialogFooter, DialogHeader, Button
} from "@material-tailwind/react";
import { useParams } from "react-router-dom";


export default function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [farms, setFarms] = useState([]);
  const [videos, setVideos] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFarms, setOpenFarms] = useState(false);
  const [openVideos, setOpenVideos] = useState(false);
  const [openPosts, setOpenPosts] = useState(false);
  const [users, setUsers] = useState([]); 


  const [openVideoDialog, setOpenVideoDialog] = useState(false);        
  const [selectedFarmVideos, setSelectedFarmVideos] = useState([]);     
  const [selectedFarmName, setSelectedFarmName] = useState("");


  const fetchPaginatedData = async (url, config) => {
    let allData = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const res = await axios.get(`${url}?page=${page}&limit=50`, config);
      const pageData = res.data?.data || [];
      allData = [...allData, ...pageData];

      hasMore = pageData.length > 0 && pageData.length === 50;
      page++;
    }

    return allData;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [userRes, allFarms, allVideos, allPosts, allUsers ] = await Promise.all([
          axios.get(`https://api-ndolv2.nongdanonline.cc/admin-users/${id}`, config), 
          fetchPaginatedData(`https://api-ndolv2.nongdanonline.cc/adminfarms`, config), 
          fetchPaginatedData(`https://api-ndolv2.nongdanonline.cc/admin-video-farm`, config), 
          fetchPaginatedData(`https://api-ndolv2.nongdanonline.cc/admin-post-feed`, config),
          fetchPaginatedData(`https://api-ndolv2.nongdanonline.cc/admin-users`, config), 
        ]);

        setUser(userRes.data);
        setFarms(allFarms);
        setVideos(allVideos);
        setPosts(allPosts);
        setUsers(allUsers);
        
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);




  const countVideosByFarm = (farmId) => {
    return videos.filter((v) => v.farmId?.id === farmId).length;
  };

  const showFarmVideos = (farmId, farmName) => {           
    const relatedVideos = videos.filter((v) => v.farmId?.id === farmId);
    setSelectedFarmVideos(relatedVideos);
    setSelectedFarmName(farmName);
    setOpenVideoDialog(true);
  };

  const userFarms = farms.filter((f) => String(f.ownerId) === String(user?.id) || String(f.createBy) === String(user?.id));

  const userPosts = posts.filter(p => p.authorId === user?.id);

  const userVideos = videos.filter(v => v.uploadedBy?.id === user?.id);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Spinner className="h-12 w-12" /></div>;
  }

  if (!user) {
    return <Typography color="red">Không tìm thấy user.</Typography>;
  }

  return (
    <div className="p-8 space-y-8">
      {/* Thông tin user */}
      <Card className="p-6 bg-gradient-to-br from-white to-gray-50 shadow-lg rounded-xl">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <img
              src={`https://api-ndolv2.nongdanonline.cc${user.avatar}`}
              alt="avatar"
              className="w-32 h-32 rounded-full border-4 border-blue-400 shadow"
            />
          </div>

          {/* User Info */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Typography variant="h6" className="text-gray-700 font-semibold">ID:</Typography>
              <Typography className="text-gray-900">{user.id}</Typography>
            </div>
            <div>
              <Typography variant="h6" className="text-gray-700 font-semibold">Name:</Typography>
              <Typography className="text-gray-900">{user.fullName}</Typography>
            </div>
            <div>
              <Typography variant="h6" className="text-gray-700 font-semibold">Email:</Typography>
              <Typography className="text-gray-900">{user.email}</Typography>
            </div>
            <div>
              <Typography variant="h6" className="text-gray-700 font-semibold">Phone:</Typography>
              <Typography className="text-gray-900">{user.phone}</Typography>
            </div>
            <div>
              <Typography variant="h6" className="text-gray-700 font-semibold">Role:</Typography>
              <Typography className="capitalize text-gray-900">{user.role}</Typography>
            </div>
            <div>
              <Typography variant="h6" className="text-gray-700 font-semibold">Status:</Typography>
              <Typography
                className={`font-semibold ${
                  user.isActive
                    ? "text-green-500"
                    : "text-gray-500"
                }`}
              >
                {user.isActive ? "Active" : "Inactive"}
              </Typography>
            </div>
            <div>
              <Typography variant="h6" className="text-gray-700 font-semibold">Ngày tạo:</Typography>
              <Typography className="text-gray-900">{new Date(user.createdAt).toLocaleString()}</Typography>
            </div>
            <div>
              <Typography variant="h6" className="text-gray-700 font-semibold">Ngày Updated gần nhất:</Typography>
              <Typography className="text-gray-900">{new Date(user.updatedAt).toLocaleString()}</Typography>
            </div>
          </div>
        </div>

      </Card>


      {/* Thông tin Farms của user */}
      <Card>
        <div
          onClick={() => setOpenFarms(!openFarms)}
          className="cursor-pointer flex gap-2 items-center px-4 py-2 bg-gray-100 rounded-t"
        >
          <Typography variant="h5">
            Danh sách Farms ({userFarms.length})
          </Typography>
          <Typography variant="h5" className={`transform transition-transform duration-300 ${openFarms ? "rotate-180" : ""}`}>▼</Typography>

        </div>

        <Collapse open={openFarms}>
        {openFarms && (
          <div className="overflow-hidden transition-all duration-300">
            <CardBody>
              {userFarms.length === 0 ? (
                <Typography>Chưa có Farm nào.</Typography>
              ) : userFarms.map((farm) => (
                <div key={farm._id} className="border p-4 mb-4 rounded shadow space-y-2">
                  <Typography variant="h6" className="text-blue-600">{farm.name}</Typography>
                  <Typography><b>ID:</b> {farm._id}</Typography>
                  <Typography><b>Mã nông trại:</b> {farm.code}</Typography>
                  <Typography><b>Tags:</b> {(farm.tags || []).join(", ") || "—"}</Typography>
                  <Typography><b>Trạng thái:</b> {
                    farm.status === "pending" ? "Chờ duyệt" :
                    farm.status === "active" ? "Đang hoạt động" : "Đã khóa"
                  }</Typography>
                  <Typography><b>Tỉnh/Thành phố:</b> {farm.province}</Typography>
                  <Typography><b>Quận/Huyện:</b> {farm.district}</Typography>
                  <Typography><b>Phường/Xã:</b> {farm.ward}</Typography>
                  <Typography><b>Đường:</b> {farm.street}</Typography>
                  <Typography><b>Vị trí tổng quát:</b> {farm.location}</Typography>
                  <Typography><b>Tổng diện tích (m²):</b> {farm.area}</Typography>
                  <Typography><b>Đất canh tác (m²):</b> {farm.cultivatedArea}</Typography>
                  <Typography><b>Dịch vụ:</b> {(farm.services || []).join(", ") || "—"}</Typography>
                  <Typography><b>Tính năng:</b> {(farm.features || []).join(", ") || "—"}</Typography>
                  {farm.ownerInfo && (
                    <>
                      <Typography><b>Chủ sở hữu:</b> {farm.ownerInfo.name}</Typography>
                      <Typography><b>Số điện thoại:</b> {farm.ownerInfo.phone}</Typography>
                      <Typography><b>Email:</b> {farm.ownerInfo.email}</Typography>
                    </>
                  )}
                  {farm.description && (
                    <div>
                      <Typography><b>Mô tả:</b></Typography>
                      <Typography className="italic text-gray-700">{farm.description}</Typography>
                    </div>
                  )}

                  {/* Số lượng video và nút xem chi tiết */}
                  <div className="flex gap-3 items-center mt-2">
                    <Typography color="deep-purple">
                      <b>Số lượng video:</b> {countVideosByFarm(farm._id)}
                    </Typography>
                    <Button
                      size="sm"
                      color="blue"
                      onClick={() => showFarmVideos(farm._id, farm.name)}
                    >
                      Xem chi tiết
                    </Button>
                  </div>

                  {farm.pictures?.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                      {farm.pictures.map((img, idx) => (
                        <img
                          key={idx}
                          src={`https://api-ndolv2.nongdanonline.cc${img.url || img.path || img.image}`}
                          alt={`Hình ${idx + 1}`}
                          className="w-full h-40 object-cover rounded"
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </CardBody>
          </div>
        )}
      </Collapse>
      </Card>

      {/* Danh sách video */}
      <Card>
        <div
          onClick={() => setOpenVideos(!openVideos)}
          className="cursor-pointer flex gap-2 items-center px-4 py-2 bg-gray-100 rounded-t"
        >
          <Typography variant="h5">
            Danh sách Videos ({userVideos.length})
          </Typography>
          <Typography
            variant="h5"
            className={`transform transition-transform duration-300 ${openVideos ? "rotate-180" : ""}`}
          >
            ▼
          </Typography>
        </div>

        <Collapse open={openVideos}>
          {openVideos && (
            <div className="overflow-hidden transition-all duration-300">
              <CardBody>
                {userVideos.length === 0 ? (
                  <Typography>Chưa có video nào.</Typography>
                ) : userVideos.map((video) => (
                  <div key={video._id} className="border p-4 mb-6 rounded shadow">
                    <Typography variant="h6" className="mb-2">{video.title}</Typography>

                     <Typography className="mb-2 text-sm text-gray-700">
                      <strong>Thuộc Farm:</strong>{" "}
                      {video.farmId?.name || <span className="text-red-500">Không thuộc farm nào</span>}
                    </Typography>
                    
                    {/* Video player */}
                    {video.status === "pending" && video.localFilePath ? (
                      <video
                        src={
                          video.localFilePath.startsWith('http')
                            ? video.localFilePath
                            : `https://api-ndolv2.nongdanonline.cc${video.localFilePath}`
                        }
                        controls
                        className="h-[300px] w-full rounded shadow mb-4"
                      />
                    ) : video.youtubeLink && video.status === "uploaded" ? (
                      video.youtubeLink.endsWith(".mp4") ? (
                        <video
                          src={video.youtubeLink}
                          controls
                          className="h-[320px] w-[600px] rounded shadow mb-4 mx-auto"
                        />
                      ) : (
                        <iframe
                          src={
                            "https://www.youtube.com/embed/" +
                            (video.youtubeLink.match(/(?:v=|\/embed\/|\.be\/)([^\s&?]+)/)?.[1] || "")
                          }
                          title="YouTube video"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="h-[320px] w-[600px] rounded shadow mb-4 mx-auto"
                        />
                      )
                    ) : (
                      <div className="flex items-center justify-center h-[300px] text-red-500 font-semibold bg-gray-100 rounded shadow mb-4">
                        Video không tồn tại
                      </div>
                    )}

                    {/* Thông tin video */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
                      <span>Danh sách phát: <strong>{video.playlistName}</strong></span>
                      <span>Tên Farm: <strong>{video.farmId?.name}</strong></span>
                      <span>Ngày đăng: <strong>{new Date(video.createdAt).toLocaleDateString()}</strong></span>
                      <span>Người đăng: <strong>{video.uploadedBy?.fullName}</strong></span>
                      <span>Email: <strong>{video.uploadedBy?.email}</strong></span>
                      <span>Trạng thái: <strong>{video.status}</strong></span>
                      <span>Link Local: <strong>{video.localFilePath}</strong></span>
                      <span>Link YouTube: <strong>{video.youtubeLink || "Không có"}</strong></span>
                    </div>
                  </div>
                ))}
              </CardBody>
            </div>
          )}
        </Collapse>
      </Card>

      <Dialog
        open={openVideoDialog}
        size="xl"
        handler={() => setOpenVideoDialog(false)}
      >
        <DialogHeader>Danh sách video - {selectedFarmName}</DialogHeader>

        <DialogBody className="space-y-6 max-h-[560px] overflow-y-auto">
          {selectedFarmVideos.length === 0 ? (
            <Typography>Không có video nào cho farm này.</Typography>
          ) : (
            selectedFarmVideos.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow p-4 border"
              >
                <Typography variant="h6" className="mb-2 font-semibold">
                  {item.title}
                </Typography>

                {/* Video hiển thị */}
                {item.status === "pending" && item.localFilePath ? (
                  <video
                    src={
                      item.localFilePath.startsWith('http')
                        ? item.localFilePath
                        : `https://api-ndolv2.nongdanonline.cc${item.localFilePath}`
                    }
                    controls
                    className="h-[300px] w-full rounded shadow mb-4"
                  >
                    Trình duyệt không hỗ trợ video
                  </video>
                ) : item.youtubeLink && item.status === "uploaded" ? (
                  item.youtubeLink.endsWith(".mp4") ? (
                    <video
                      src={item.youtubeLink}
                      controls
                      className="h-[320px] w-[600px] rounded shadow mb-4 mx-auto"
                    />
                  ) : (
                    <iframe
                      src={
                        "https://www.youtube.com/embed/" +
                        (item.youtubeLink.match(/(?:v=|\/embed\/|\.be\/)([^\s&?]+)/)?.[1] || "")
                      }
                      title="YouTube video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="h-[320px] w-[600px] rounded shadow mb-4 mx-auto"
                    ></iframe>
                  )
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-red-500 font-semibold bg-gray-100 rounded shadow mb-4">
                    Video không tồn tại
                  </div>
                )}

                {/* Thông tin video */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
                  <span>Danh sách phát: <strong>{item.playlistName}</strong></span>
                  <span>Tên Farm: <strong>{item.farmId?.name}</strong></span>
                  <span>Ngày đăng: <strong>{new Date(item.createdAt).toLocaleDateString()}</strong></span>
                  <span>Người đăng: <strong>{item.uploadedBy?.fullName}</strong></span>
                  <span>Email: <strong>{item.uploadedBy?.email}</strong></span>
                  <span>Trạng thái: <strong>{item.status}</strong></span>
                  <span>Link Local: <strong>{item.localFilePath}</strong></span>
                  <span>Link YouTube: <strong>{item.youtubeLink || "Không có"}</strong></span>
                </div>
              </div>
            ))
          )}
        </DialogBody>

        <DialogFooter>
          <Button color="red" onClick={() => setOpenVideoDialog(false)}>
            Đóng
          </Button>
        </DialogFooter>
      </Dialog>

      {/* danh sách post */}
      <Card>
        <div
          onClick={() => setOpenPosts(!openPosts)}
          className="cursor-pointer flex gap-2 items-center px-4 py-2 bg-gray-100 rounded-t"
        >
          <Typography variant="h5">
            Danh sách Posts ({userPosts.length})
          </Typography>
          <Typography
            variant="h5"
            className={`transform transition-transform duration-300 ${openPosts ? "rotate-180" : ""}`}
          >
            ▼
          </Typography>
        </div>

        <Collapse open={openPosts}>
          {openPosts && (
            <div className="overflow-hidden transition-all duration-300">
              <CardBody>
                {userPosts.length === 0 ? (
                  <Typography>Chưa có bài viết nào.</Typography>
                ) : userPosts.map((post) => (
                  <div key={post._id} className="border p-4 mb-6 rounded shadow">
                    {/* Tiêu đề */}
                    <Typography variant="h6" className="mb-2">{post.title}</Typography>

                    {/* Ngày tạo và cập nhật */}
                    <div className="text-sm text-gray-600 mb-2">
                      <p><b>Ngày tạo:</b> {new Date(post.createdAt).toLocaleString("vi-VN")}</p>
                      <p><b>Cập nhật:</b> {new Date(post.updatedAt).toLocaleString("vi-VN")}</p>
                    </div>

                    {/* Tác giả */}
                    <div className="flex items-center gap-3 mb-2">
                      <Typography className="font-semibold">Tác giả:</Typography>
                      <img
                        src={
                          users.find(u => u.id === post.authorId)?.avatar?.startsWith("http")
                            ? users.find(u => u.id === post.authorId)?.avatar
                            : `https://api-ndolv2.nongdanonline.cc${users.find(u => u.id === post.authorId)?.avatar || ""}`
                        }
                        alt={users.find(u => u.id === post.authorId)?.fullName}
                        className="w-8 h-8 rounded-full"
                      />
                      <Typography>
                        {users.find(u => u.id === post.authorId)?.fullName || "Không rõ"}
                      </Typography>
                    </div>

                    {/* Mô tả */}
                    <Typography className="mb-3">
                      <b>Mô tả:</b> {post.description}
                    </Typography>

                    {/* Tags */}
                    <div className="flex gap-2 flex-wrap mb-3">
                      <Typography className="font-semibold text-gray-700">Tags:</Typography>
                      {post.tags?.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Hình ảnh */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {post.images?.map((img, idx) => (
                        <img
                          key={idx}
                          src={`https://api-ndolv2.nongdanonline.cc${img}`}
                          alt={`img-${idx}`}
                          className="w-full h-40 object-cover rounded shadow"
                        />
                      ))}
                    </div>

                    
                    
                  </div>
                ))}
              </CardBody>
            </div>
          )}
        </Collapse>
      </Card>
    </div>
  );
}
