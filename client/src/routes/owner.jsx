//page
import ProfilePage from "../components/pages/owner/profile-page";
import EditProfile from "../components/pages/owner/edit-profile";
import CompanyAnnounce from "../components/pages/owner/company-announce";
import CompanyCreate from "../components/pages/owner/company-create";
import CompanyDescrip from "../components/pages/owner/company-descrip";
import ManageEmployee from "../components/pages/owner/manage-employee";
import ReviewEmployee from "../components/pages/owner/review-employee";

//layout
import { DLayout } from "../components/layouts/dashboard/d-layout";

const routeDashboardOwner = [
  {
    path: "/dashboard-owner",
    element: <DLayout />,
    children: [
      {
        path: "profile", // localhost:4000/dashboard-owner/profile
        element: <ProfilePage />,
      },
      {
        path: "edit-profile/:id", // localhost:4000/dashboard-owner/edit-profile
        element: <EditProfile />,
      },
      {
        path: "company-announce", // localhost:4000/dashboard-owner/company-announce
        element: <CompanyAnnounce />,
      },
      {
        path: "company-create/:id", // localhost:4000/dashboard-owner/cratework
        element: <CompanyCreate />,
      },
      {
        path: "company-descrip/:id", // localhost:4000/dashboard-owner/work-details
        element: <CompanyDescrip />,
      },
      {
        path: "manage-employee", // localhost:4000/dashboard-owner/manage-employee
        element: <ManageEmployee />,
      },
      {
        path: "review-employee", // localhost:4000/dashboard-owner/review-employee
        element: <ReviewEmployee />,
      },
    ],
  },
];

export default routeDashboardOwner;
