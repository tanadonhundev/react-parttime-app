//page
import ProfilePage from "../components/pages/employee/profile-page";
import EditProfile from "../components/pages/employee/edit-profile";
import WorkAnnounce from "../components/pages/employee/work-announce";
import WorkDescrip from "../components/pages/employee/work-descrip";
import WorkApply from "../components/pages/employee/work-apply";
import ReviewOwner from "../components/pages/employee/review-owner";
import ChatPage from "../components/pages/chat-page";
//layout
import { DLayout } from "../components/layouts/dashboard/d-layout";

const routeDashboardEmployee = [
  {
    path: "/dashboard-employee",
    element: <DLayout />,
    children: [
      {
        path: "profile", // localhost:4000/dashboard-employee/profile
        element: <ProfilePage />,
      },
      {
        path: "edit-profile/:id", // localhost:4000/dashboard-employee/edit-profile
        element: <EditProfile />,
      },
      {
        path: "work-announce", // localhost:4000/dashboard-employee/work-announce
        element: <WorkAnnounce />,
      },
      {
        path: "work-descrip/:id", // localhost:4000/dashboard-employee/work-descrip
        element: <WorkDescrip />,
      },
      {
        path: "work-apply", // localhost:4000/dashboard-employee/work-apply
        element: <WorkApply />,
      },
      {
        path: "review-owner", // localhost:4000/dashboard-employee/review-owner
        element: <ReviewOwner />,
      },
      {
        path: "chat", // localhost:4000/dashboard-employee/chat
        element: <ChatPage />,
      },
    ],
  },
];

export default routeDashboardEmployee;
