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
import { getReviewEmployee } from "../../../services/review";
import { Divider } from "@mui/material";

export default function ProfilePage() {
  const [data, setData] = useState([]);
  const [review, setReview] = useState([]);
  const [avatarImage, setAvatarImage] = useState();
  const [idcardImage, setIdcardImage] = useState();
  const [loading, setLoading] = useState(true);

  const baseURL = import.meta.env.VITE_API;

  useEffect(() => {
    const token = localStorage.getItem("token");
    currentUser(token)
      .then((res) => {
        const id = res.data._id;
        loadData(token, id);
        loadReview(token, id);
      })
      .catch((error) => console.log(error));
  }, []);

  const loadData = async (token, id) => {
    profileUser(token, id)
      .then((res) => {
        setData(res.data);
        setAvatarImage(res.data.avatarphoto);
        setIdcardImage(res.data.idcardphoto);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };

  const loadReview = async (token, id) => {
    getReviewEmployee(token, id)
      .then((res) => {
        setReview(res.data);
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
            <Typography>กำลังโหลดข้อมูลข้อมูล</Typography>
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
                  src={`${baseURL}/uploads/avatar/` + avatarImage}
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
                  to={`/dashboard-employee/edit-profile/${data._id}`}
                  variant="contained"
                  color="primary"
                  startIcon={<EditIcon />}
                >
                  แก้ไขข้อมูลส่วนตัว
                </Button>
              </Stack>
            </Paper>
            <Paper
              style={{
                padding: 16,
                marginBottom: 16,
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                borderRadius: 8,
                background: "#fff",
              }}
            >
              <Typography variant="h6" gutterBottom>
                รีวิว
              </Typography>
              {review.length === 0 ? (
                <Typography variant="body1">ไม่มีรีวิว</Typography>
              ) : (
                review.map((reviewItem, index) => (
                  <div key={index}>
                    <Divider sx={{ margin: "8px 0" }} />
                    <Stack>
                      <Typography variant="subtitle1">
                        {reviewItem.companyName}
                      </Typography>
                      <Typography variant="subtitle1">
                        {dayjs(reviewItem.workDay)
                          .locale("th")
                          .format("ddd DD MMM")}
                      </Typography>
                      <Typography variant="subtitle1">
                        วัน-เวลาที่รีวิว:{" "}
                        {dayjs(reviewItem.createdAt)
                          .locale("th")
                          .format("ddd DD MMM HH:mm:ss")}
                      </Typography>
                      <Typography variant="body1">
                        คะแนน: {reviewItem.employeeRating}
                      </Typography>
                      <Typography variant="body1">
                        ข้อความ: {reviewItem.employeeReviewText}
                      </Typography>
                      <Divider sx={{ margin: "8px 0" }} />
                    </Stack>
                  </div>
                ))
              )}
            </Paper>
          </Box>
        ) : (
          <p>No data available</p>
        )}
      </Box>
    </>
  );
}
