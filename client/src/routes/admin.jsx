//page
import ManageUser from "../components/pages/admin/manage-user";
import VerifyUser from "../components/pages/admin/verify-user";
import ChatPage from "../components/pages/chat-page";
import ReportPage from "../components/pages/admin/report-page";

//layout
import { DLayout } from "../components/layouts/dashboard/d-layout";

const routeDashboardAdmin = [
  {
    path: "/dashboard-admin",
    element: <DLayout />,
    children: [
      {
        path: "manage-user", // localhost:4000/dashboard-admin/manage-user
        element: <ManageUser />,
      },
      {
        path: "verify-user/:id", // localhost:4000/dashboard-admin/verify-user
        element: <VerifyUser />,
      },
      {
        path: "chat", // localhost:4000/dashboard-employee/chat
        element: <ChatPage />,
      },
      {
        path: "report", // localhost:4000/dashboard-employee/report
        element: <ReportPage />,
      },
    ],
  },
];

export default routeDashboardAdmin;
