import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";

import EditIcon from "@mui/icons-material/Edit";

import dayjs from "dayjs";
import "dayjs/locale/th";

import { currentUser } from "../../../services/auth";
import { profileUser } from "../../../services/user";

export default function ProfilePage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    currentUser(token)
      .then((res) => {
        const id = res.data._id;
        loadData(token, id);
      })
      .catch((error) => console.log(error));
  }, []);

  const loadData = async (token, id) => {
    profileUser(token, id)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        {loading ? (
          <p>Loading...</p>
        ) : data ? (
          <Box
            sx={{
              width: "100%",
              maxWidth: 500,
              textAlign: "start",
              padding: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              ชื่่อ: {data.firstName}
            </Typography>
            <Typography variant="h6" gutterBottom>
              นามสกุล: {data.lastName}
            </Typography>
            <Typography variant="h6" gutterBottom>
              อีเมล: {data.email}
            </Typography>
            <Typography variant="h6" gutterBottom>
              วันเดือนปีเกิด:{" "}
              {dayjs(data.birthDay).locale("th").format("DD MM YYYY")}
            </Typography>
            <Typography variant="h6" gutterBottom>
              อายุ: {data.age}
            </Typography>
          </Box>
        ) : (
          <p>No data available</p>
        )}
        <Button
          component={Link}
          to={`/dashboard-employee/edit-profile/${data._id}`}
          variant="contained"
          color="primary"
          startIcon={<EditIcon />}
        >
          แก้ไขโปรไฟล์
        </Button>
      </Box>
    </>
  );
}
