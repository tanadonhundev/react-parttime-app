import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import EditIcon from "@mui/icons-material/Edit";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Rating from "@mui/material/Rating";

import { Link } from "react-router-dom";

import dayjs from "dayjs";
import "dayjs/locale/th";

import { currentUser } from "../../../services/auth";
import { profileUser } from "../../../services/user";
import { getReviewEmployee } from "../../../services/review";

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
      {loading ? (
        <Stack alignItems={"center"}>
          <CircularProgress />
          <Typography>กำลังโหลดข้อมูลข้อมูล</Typography>
        </Stack>
      ) : data ? (
        <>
          <Paper
            style={{
              padding: 16,
              marginBottom: 16,
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              borderRadius: 8,
              background: "#fff",
            }}
          >
            <Stack direction="row" justifyContent="flex-end">
              {data.statusVerify === "รอตรวจสอบ" && (
                <Button variant="outlined" color="warning">
                  {data.statusVerify}
                </Button>
              )}
              {data.statusVerify === "ตรวจสอบแล้ว" && (
                <Button variant="outlined" color="success">
                  {data.statusVerify}
                </Button>
              )}
              {data.statusVerify === "รอแก้ไขข้อมูล" && (
                <Button variant="outlined" color="success">
                  {data.statusVerify}
                </Button>
              )}
            </Stack>
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

            <Grid
              container
              direction="row"
              justifyContent="space-around"
              alignItems="flex-start"
            >
              <Grid item xs={6}>
                <Typography variant="h6" gutterBottom>
                  ชื่อ: {data.firstName}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" gutterBottom>
                  นามสกุล: {data.lastName}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" gutterBottom>
                  วันเดือนปีเกิด:
                  {dayjs(data.birthDay).locale("th").format("DD/MM/YYYY")}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" gutterBottom>
                  อายุ: {data.age} ปี
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" gutterBottom>
                  อีเมล: {data.email}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" gutterBottom>
                  เบอร์โทรศัพท์: {data.phoneNumber}
                </Typography>
              </Grid>
            </Grid>
            <Stack direction={"column"} alignItems={"center"}>
              <Typography variant="h6" gutterBottom>
                รูปบัตรประชาชน
              </Typography>
              <Card sx={{ maxWidth: 500 }}>
                <CardMedia
                  component="img"
                  width="200"
                  height="250"
                  src={`${baseURL}/uploads/idcard/` + idcardImage}
                  alt="Company Image"
                />
              </Card>
              <Typography variant="h6" gutterBottom>
                ที่อยู่ตามบัตรประชาชน
              </Typography>
            </Stack>
            <Grid
              container
              direction="row"
              justifyContent="space-around"
              alignItems="flex-start"
            >
              <Grid item xs={6}>
                <Typography variant="h6" gutterBottom>
                  บ้านเลขที่: {data.houseNumber}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" gutterBottom>
                  หมู่ที่: {data.groupNumber}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" gutterBottom>
                  ตำบล: {data.subDistrict}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" gutterBottom>
                  อำเภอ: {data.district}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" gutterBottom>
                  จังหวัด: {data.proVince}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" gutterBottom>
                  รหัสไปรษณีย์: {data.postCode}
                </Typography>
              </Grid>
            </Grid>
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
              ข้อมูลการรีวิว
            </Typography>
            {review.length === 0 ? (
              <Typography variant="body1">ไม่มีรีวิว</Typography>
            ) : (
              review.map((reviewItem, index) => (
                <div key={index}>
                  <Divider sx={{ margin: "8px 0" }} />
                  <Stack>
                    <Typography variant="subtitle1">
                      {reviewItem.companyName} |{" "}
                      {dayjs(reviewItem.createdAt)
                        .locale("th")
                        .format("DD-MM-YYYY HH:mm:ss")}
                    </Typography>
                    <Typography variant="subtitle1">
                      วันที่ทำงาน:
                      {dayjs(reviewItem.workDay)
                        .locale("th")
                        .format("DD-MM-YYYY")}
                    </Typography>

                    <Stack direction={"row"}>
                      <Typography variant="body1">คะแนน:</Typography>
                      <Rating
                        name="half-rating-read"
                        defaultValue={reviewItem.rating}
                        readOnly
                      />
                    </Stack>
                    <Typography variant="body1">
                      ข้อความ: {reviewItem.reviewText}
                    </Typography>
                    <Divider sx={{ margin: "8px 0" }} />
                  </Stack>
                </div>
              ))
            )}
          </Paper>
        </>
      ) : (
        <p>No data available</p>
      )}
    </>
  );
}
