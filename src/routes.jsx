import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
  NewspaperIcon,
  ReceiptPercentIcon
} from "@heroicons/react/24/solid";

import VideoLikeList from "@/pages/dashboard/VideoLikeList";
import { Home, Users, Farms, Questions, AnswersTable, VideoFarms, PostList, AdminReports } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";
import { ViewfinderCircleIcon } from "@heroicons/react/24/outline";
import { element } from "prop-types";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "Users",
        path: "/Users",
        element: <Users />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Farms",
        path: "/Farms",
        element: <Farms />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "Questions",
        path: "/Questions",
        element: <Questions />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "AnswersTable",
        path: "/AnswersTable",
        element: <AnswersTable />,
      },
      {
        icon: <ViewfinderCircleIcon {...icon} />,
        name: "VideoFarms",
        path: "/VideoFarms",
        element: <VideoFarms />,
      },
      {
        icon: <NewspaperIcon {...icon} />,
        name: "PostList",
        path: "/PostList",
        element: <PostList />,
      },
      {
        icon: <ReceiptPercentIcon {...icon} />,
        name: "AdminReports",
        path: "/AdminReports",
        element: <AdminReports />,
      }
  
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "sign up",
        path: "/sign-up",
        element: <SignUp />,
      },
    ],
  },
];

export default routes;
