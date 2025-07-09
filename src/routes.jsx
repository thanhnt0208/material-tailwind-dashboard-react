import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
  ViewfinderCircleIcon,
  DocumentDuplicateIcon, // icon mới cho AdminReports
} from "@heroicons/react/24/solid";

import {
  Home,
  Users,
  Farms,
  Questions,
  AnswersTable,
  VideoFarms,
  AdminReports, // import thêm
} from "@/pages/dashboard";

import { SignIn, SignUp } from "@/pages/auth";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "Dashboard",
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
        name: "Answers Table",
        path: "/AnswersTable",
        element: <AnswersTable />,
      },
      {
        icon: <ViewfinderCircleIcon {...icon} />,
        name: "Video Farms",
        path: "/VideoFarms",
        element: <VideoFarms />,
      },
      {
        icon: <DocumentDuplicateIcon {...icon} />,
        name: "Admin Reports",          // tên hiển thị
        path: "/AdminReports",          // URL
        element: <AdminReports />,      // component
      },
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "Sign in",
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "Sign up",
        path: "/sign-up",
        element: <SignUp />,
      },
    ],
  },
];

export default routes;
