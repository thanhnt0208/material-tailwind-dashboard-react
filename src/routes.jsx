import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/solid";
import { Home, Users , Farms, Questions, AnswersTable, VideoFarms,CommentPost } from "@/pages/dashboard";



import { SignIn, SignUp } from "@/pages/auth";
import { ViewfinderCircleIcon } from "@heroicons/react/24/outline";
import { Comment } from "react-loader-spinner";

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
        icon: <VideoCameraIcon {...icon} />,
        name: "VideoFarms",
        path: "/VideoFarms",
        element: <VideoFarms />,

      },
        {
        icon: <ChatBubbleOvalLeftEllipsisIcon {...icon} />,
        name: "CommentPost",
        path: "/CommentPost",
        element: <CommentPost />,

      },
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
