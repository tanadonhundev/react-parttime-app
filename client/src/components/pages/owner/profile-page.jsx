import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import EditIcon from "@mui/icons-material/Edit";
import CircularProgress from "@mui/material/CircularProgress";

import { Link } from "react-router-dom";

import dayjs from "dayjs";
import "dayjs/locale/th";

import { currentUser } from "../../../services/auth";
import { profileUser } from "../../../services/user";

export default function ProfilePage() {
  const [data, setData] = useState([]);
  const [avatarImage, setAvatarImage] = useState();
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
        setAvatarImage(res.data.avatarphoto);
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
          alignItems: "center",
        }}
      >
        {loading ? (
          <Stack alignItems={"center"}>
            <CircularProgress />
          </Stack>
        ) : data ? (
          <Box
            sx={{
              width: "100%",
              maxWidth: 500,
              textAlign: "start",
              padding: 2,
            }}
          >
            <Paper
              style={{
                padding: 16,
                marginBottom: 16,
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                borderRadius: 8,
                background: "#fff",
              }}
            >
              <Stack alignItems={"center"}>
                <Typography variant="h6" gutterBottom>
                  ข้อมูลส่วนตัว
                </Typography>
                <Avatar
                  sx={{ width: 150, height: 150 }}
                  alt="Remy Sharp"
                  src={"http://localhost:5000/uploads/avatar/" + avatarImage}
                />
              </Stack>
              <Typography variant="h6" gutterBottom>
                ชื่่อ: {data.firstName}
              </Typography>
              <Typography variant="h6" gutterBottom>
                นามสกุล: {data.lastName}
              </Typography>
              <Typography variant="h6" gutterBottom>
                วันเดือนปีเกิด:
                {dayjs(data.birthDay).locale("th").format("DD/MM/YYYY")}
              </Typography>
              <Typography variant="h6" gutterBottom>
                อายุ: {data.age} ปี
              </Typography>
              <Typography variant="h6" gutterBottom>
                อีเมล: {data.email}
              </Typography>
              <Typography variant="h6" gutterBottom>
                เบอร์โทรศัพท์: {data.phoneNumber}
              </Typography>
              <Stack alignItems={"flex-end"}>
                <Button
                  component={Link}
                  to={`/dashboard-owner/edit-profile/${data._id}`}
                  variant="contained"
                  color="primary"
                  startIcon={<EditIcon />}
                >
                  แก้ไขข้อมูลส่วนตัว
                </Button>
              </Stack>
            </Paper>
          </Box>
        ) : (
          <p>No data available</p>
        )}
      </Box>
    </>
  );
}
