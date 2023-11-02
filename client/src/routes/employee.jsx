//page
import HomeEmployee from "../components/pages/employee/home-employee";
import ProfilePage from "../components/pages/employee/profile-page";
import EditProfile from "../components/pages/employee/edit-profile";
import WorkAnnounce from "../components/pages/employee/work-announce";
import WorkDescrip from "../components/pages/employee/work-descrip";

//layout
import { DLayout } from "../components/layouts/dashboard/d-layout";

const routeDashboardEmployee = [
  {
    path: "/dashboard-employee",
    element: <DLayout />,
    children: [
      {
        path: "", // localhost:4000/dashboard-employee
        element: <HomeEmployee />,
      },
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
    ],
  },
];

export default routeDashboardEmployee;
