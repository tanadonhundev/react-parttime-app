import React, { useEffect, useState } from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import WorkIcon from "@mui/icons-material/Work";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import ReviewsIcon from "@mui/icons-material/Reviews";

import { NavLink, useLocation } from "react-router-dom";
import { currentUser } from "../../../services/auth";

export const DMenu = () => {
  const [role, setRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    currentUser(token)
      .then((res) => {
        const role = res.data.role;
        setRole(role);
      })
      .catch((error) => console.log(error));
  }, []);

  const location = useLocation();
  const adminMenu = [
    {
      label: "จัดการผู้ใช้งาน",
      icon: <PeopleIcon />,
      href: "/dashboard-admin/manage-user",
    },
  ];

  const ownerMenu = [
    {
      label: "โปรไฟล์",
      icon: <AccountBoxIcon />,
      href: "/dashboard-owner/profile",
    },
    {
      label: "ประกาศจ้างงาน",
      icon: <WorkIcon />,
      href: "/dashboard-owner/company-announce",
    },
    {
      label: "จัดการพนักงาน",
      icon: <ManageAccountsIcon />,
      href: "/dashboard-owner/manage-employee",
    },
    {
      label: "รีวิวพนักงาน",
      icon: <ReviewsIcon />,
      href: "/dashboard-owner/review-employee",
    },
  ];

  const employeeMenu = [
    {
      label: "โปรไฟล์",
      icon: <AccountBoxIcon />,
      href: "/dashboard-employee/profile",
    },
    {
      label: "ประกาศจ้างงาน",
      icon: <WorkIcon />,
      href: "/dashboard-employee/work-announce",
    },
    {
      label: "งานที่สมัคร",
      icon: <ManageAccountsIcon />,
      href: "/dashboard-employee/work-apply",
    },
    {
      label: "รีวิวนายจ้าง",
      icon: <ReviewsIcon />,
      href: "/dashboard-employee/review-owner",
    },
  ];

  return (
    <React.Fragment>
      {role === "admin"
        ? adminMenu.map((item) => (
            <ListItemButton
              key={item.label}
              component={NavLink}
              to={item.href}
              sx={{
                backgroundColor:
                  location.pathname === item.href ? "grey.300" : "",
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))
        : role === "owner"
        ? ownerMenu.map((item) => (
            <ListItemButton
              key={item.label}
              component={NavLink}
              to={item.href}
              sx={{
                backgroundColor:
                  location.pathname === item.href ? "grey.300" : "",
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))
        : role === "employee"
        ? employeeMenu.map((item) => (
            <ListItemButton
              key={item.label}
              component={NavLink}
              to={item.href}
              sx={{
                backgroundColor:
                  location.pathname === item.href ? "grey.500" : "",
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))
        : null}
    </React.Fragment>
  );
};
