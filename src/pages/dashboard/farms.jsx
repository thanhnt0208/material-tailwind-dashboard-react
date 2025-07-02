import React, { useState } from "react";
import {
  Card,
  CardBody,
  Input,
  Button,
  Typography,
  Checkbox,
  Chip,
} from "@material-tailwind/react";
import {
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";

// Dữ liệu mẫu – bạn có thể thay thế bằng dữ liệu lấy từ API
const products = [
  {
    id: "#194556",
    name: "Education Dashboard",
    category: "Html templates",
    technology: "Angular",
    description: "Start developing with an open‑source...",
    price: "$149",
    discount: "No",
  },
  {
    id: "#623232",
    name: "React UI Kit",
    category: "Html templates",
    technology: "React JS",
    description: "Start developing with an open‑source...",
    price: "$129",
    discount: "10%",
  },
  {
    id: "#194356",
    name: "Education Dashboard",
    category: "Html templates",
    technology: "Angular",
    description: "Start developing with an open‑source...",
    price: "$149",
    discount: "No",
  },
  {
    id: "#323323",
    name: "React UI Kit",
    category: "Html templates",
    technology: "React JS",
    description: "Start developing with an open‑source...",
    price: "$129",
    discount: "No",
  },
  {
    id: "#994856",
    name: "Education Dashboard",
    category: "Html templates",
    technology: "Angular",
    description: "Start developing with an open‑source...",
    price: "$149",
    discount: "25%",
  },
  {
    id: "#194256",
    name: "Education Dashboard",
    category: "Html templates",
    technology: "Angular",
    description: "Start developing with an open‑source...",
    price: "$149",
    discount: "10%",
  },
];

export function Farms() {
  const [search, setSearch] = useState("");

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card className="p-6">
      {/* Tiêu đề + nút thêm mới */}
      <div className="flex items-center justify-between mb-6">
        <Typography variant="h4">All products</Typography>
        <Button color="blue" className="flex items-center gap-2">
          <PlusIcon strokeWidth={2} className="h-5 w-5" />
          Add new product
        </Button>
      </div>

      {/* Ô tìm kiếm */}
      <Input
        label="Search for products"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6"
      />

      {/* Bảng dữ liệu */}
      <CardBody className="overflow-x-auto p-0">
        <table className="w-full min-w-[1000px] table-auto">
          <thead>
            <tr className="text-left">
              <th className="w-10 px-4">
                <Checkbox ripple={false} containerProps={{ className: "p-0" }} />
              </th>
              {[
                "PRODUCT NAME",
                "TECHNOLOGY",
                "DESCRIPTION",
                "ID",
                "PRICE",
                "DISCOUNT",
                "ACTIONS",
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
            {filteredProducts.map((product, idx) => (
              <tr
                key={product.id}
                className={
                  idx !== filteredProducts.length - 1 ? "border-b" : ""
                }
              >
                <td className="py-4 px-4">
                  <Checkbox ripple={false} containerProps={{ className: "p-0" }} />
                </td>
                <td className="py-4 px-4">
                  <Typography variant="small" className="font-semibold">
                    {product.name}
                  </Typography>
                  <Typography variant="small" className="text-blue-gray-500">
                    {product.category}
                  </Typography>
                </td>
                <td className="py-4 px-4">
                  <Typography variant="small">{product.technology}</Typography>
                </td>
                <td className="py-4 px-4 max-w-[250px] truncate">
                  <Typography variant="small">{product.description}</Typography>
                </td>
                <td className="py-4 px-4 font-medium">{product.id}</td>
                <td className="py-4 px-4 font-medium">{product.price}</td>
                <td className="py-4 px-4">
                  {product.discount === "No" ? (
                    <Typography variant="small">No</Typography>
                  ) : (
                    <Chip size="sm" value={product.discount} color="green" />
                  )}
                </td>
                <td className="py-4 px-4">
                  <div className="flex gap-2">
                    <Button size="sm" className="flex items-center gap-2">
                      <PencilSquareIcon className="h-4 w-4" /> Update
                    </Button>
                    <Button size="sm" color="red" className="flex items-center gap-2">
                      <TrashIcon className="h-4 w-4" /> Delete item
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardBody>
    </Card>
  );
}
export default Farms;