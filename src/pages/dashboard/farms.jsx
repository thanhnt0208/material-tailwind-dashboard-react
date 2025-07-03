import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card, CardBody, Input, Button, Typography, Checkbox, Chip,
} from "@material-tailwind/react";
import {
  PencilSquareIcon, TrashIcon, PlusIcon,
} from "@heroicons/react/24/solid";

export function Farms() {
  const [farms, setFarms] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const token = localStorage.getItem("token"); // hoặc lấy từ context
        const res = await axios.get("https://api-ndolv2.nongdanonline.vn/adminfarms", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFarms(res.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFarms();
  }, []);

  const filteredFarms = farms.filter((farm) =>
    farm.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <Typography variant="h4">Danh sách nông trại</Typography>
        <Button color="blue" className="flex items-center gap-2">
          <PlusIcon className="h-5 w-5" /> Thêm nông trại
        </Button>
      </div>

      <Input
        label="Tìm kiếm nông trại"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6"
      />

      {loading && <Typography>Đang tải dữ liệu...</Typography>}
      {error && <Typography color="red">Lỗi: {error}</Typography>}

      {!loading && !error && (
        <CardBody className="overflow-x-auto p-0">
          <table className="w-full min-w-[1100px] table-auto">
            <thead>
              <tr className="text-left">
                <th className="w-10 px-4">
                  <Checkbox ripple={false} containerProps={{ className: "p-0" }} />
                </th>
                {[
                  "TÊN FARM",
                  "MÃ FARM",
                  "CHỦ SỞ HỮU",
                  "SỐ ĐIỆN THOẠI",
                  "ĐỊA CHỈ",
                  "DIỆN TÍCH",
                  "GIÁ / THÁNG",
                  "TRẠNG THÁI",
                  "THAO TÁC",
                ].map((head) => (
                  <th key={head} className="py-3 px-4">
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredFarms.map((farm, idx) => (
                <tr key={farm.id} className={idx !== filteredFarms.length - 1 ? "border-b" : ""}>
                  <td className="py-4 px-4">
                    <Checkbox ripple={false} containerProps={{ className: "p-0" }} />
                  </td>
                  <td className="py-4 px-4 font-semibold">{farm.name}</td>
                  <td className="py-4 px-4">{farm.code}</td>
                  <td className="py-4 px-4">{farm.ownerInfo?.name || "—"}</td>
                  <td className="py-4 px-4">{farm.ownerInfo?.phone || "—"}</td>
                  <td className="py-4 px-4 max-w-[200px] truncate">{farm.location}</td>
                  <td className="py-4 px-4">{farm.area || 0} m²</td>
                  <td className="py-4 px-4">
                    {farm.pricePerMonth > 0
                      ? farm.pricePerMonth.toLocaleString("vi-VN") + " đ"
                      : "Miễn phí"}
                  </td>
                  <td className="py-4 px-4">
                    <Chip
                      size="sm"
                      value={farm.status === "pending" ? "Chờ duyệt" : farm.status}
                      color={farm.status === "pending" ? "orange" : "green"}
                    />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2">
                      <Button size="sm" className="flex items-center gap-2">
                        <PencilSquareIcon className="h-4 w-4" /> Sửa
                      </Button>
                      <Button size="sm" color="red" className="flex items-center gap-2">
                        <TrashIcon className="h-4 w-4" /> Xoá
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      )}
    </Card>
  );
}
export default Farms