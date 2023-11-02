//page
import HomeAdmin from "../components/pages/admin/home-admin";
import ManageUser from "../components/pages/admin/manage-user";
import VerifyUser from "../components/pages/admin/verify-user";

//layout
import { DLayout } from "../components/layouts/dashboard/d-layout";

const routeDashboardAdmin = [
  {
    path: "/dashboard-admin",
    element: <DLayout />,
    children: [
      {
        path: "", // localhost:4000/dashboard-admin
        element: <HomeAdmin />,
      },
      {
        path: "manage-user", // localhost:4000/dashboard-admin/manage-user
        element: <ManageUser />,
      },
      {
        path: "verify-user/:id", // localhost:4000/dashboard-admin/verify-user
        element: <VerifyUser/>,
      },
    ],
  },
];

export default routeDashboardAdmin;
