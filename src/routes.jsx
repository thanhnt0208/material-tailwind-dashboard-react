import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";
<<<<<<< Updated upstream
import { Home, Users, Tables, AcceptFarm } from "@/pages/dashboard";
=======
import { Home, User , Tables, AcceptFarm } from "@/pages/dashboard";
>>>>>>> Stashed changes
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
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
<<<<<<< Updated upstream
  icon: <UserCircleIcon {...icon} />,
  name: "users",
  path: "/users",
  element: <Users />,
},
=======
        icon: <UserCircleIcon {...icon} />,
        name: "users",
        path: "/users",
        element: <Users />,
      },
>>>>>>> Stashed changes
      {
        icon: <TableCellsIcon {...icon} />,
        name: "tables",
        path: "/tables",
        element: <Tables />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "Accept Farms",
        path: "/AcceptFarm",
        element: <AcceptFarm />,
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
