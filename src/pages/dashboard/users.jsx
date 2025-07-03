import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card, CardHeader, CardBody, CardFooter,
  Avatar, Typography, Button, Tooltip
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
export function Users() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    axios.get("https://api-ndolv2.nongdanonline.vn/users/my", {
      headers: { Authorization: "Bearer YOUR_TOKEN" }
    })
    .then(res => setUsers(res.data))
    .catch(err => console.error("Lỗi:", err));
  }, []);

  return (
    <div className="px-4 pb-4">
      <Typography variant="h6" color="blue-gray" className="mb-2">
        Users Management
      </Typography>
      <Typography variant="small" className="font-normal text-blue-gray-500">
        Danh sách người dùng
      </Typography>
      <div className="mt-6 grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-4">
        {users.map((user) => (
          <Card key={user.id} color="transparent" shadow={false}>
            <CardHeader floated={false} color="gray" className="mx-0 mt-0 mb-4 h-64 xl:h-40">
              <img
                src={user.avatar || "/img/default-avatar.png"}
                alt={user.fullName}
                className="h-full w-full object-cover"
              />
            </CardHeader>
            <CardBody className="py-0 px-1">
              <Typography variant="h5" color="blue-gray" className="mb-1">
                {user.fullName}
              </Typography>
              <Typography variant="small" className="font-normal text-blue-gray-500">
                Email: {user.email}
              </Typography>
              <Typography variant="small" className="font-normal text-blue-gray-500">
                Phone: {user.phone}
              </Typography>
              <Typography variant="small" className="font-normal text-blue-gray-500">
                Role: {user.role}
              </Typography>
              <Typography variant="small" className="font-normal text-blue-gray-500">
                Active: {user.isActive ? "Yes" : "No"}
              </Typography>
            </CardBody>
            <CardFooter className="mt-6 flex items-center justify-between py-0 px-1">
              <Link to={`/dashboard/users/${user.id}`}>
                <Button variant="outlined" size="sm">
                  VIEW USER
                </Button>
              </Link>
              <Tooltip content="Edit User">
                <Button variant="text" size="sm">
                  Edit
                </Button>
              </Tooltip>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Users;
