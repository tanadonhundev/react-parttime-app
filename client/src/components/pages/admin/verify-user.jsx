import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import CircularProgress from "@mui/material/CircularProgress";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";

import { styled } from "@mui/material/styles";

import { profileUser, statusVerify } from "../../../services/user";
import dayjs from "dayjs";
import "dayjs/locale/th";

import { Link, useNavigate, useParams } from "react-router-dom";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function VerifyUser() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [avatarImage, setAvatarImage] = useState();
  const [idcardImage, setIdcardImage] = useState();

  const baseURL = import.meta.env.VITE_API;

  const params = useParams();
  const navigate = useNavigate();

  const handleChange = (event) => {
    setStatus(event.target.value);
    //console.log(event.target.value);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    loadData(token, params.id);
  }, []);

  const onSubmit = async (token) => {
    statusVerify(token, params.id, { status })
      .then(navigate("/dashboard-admin/manage-user"))
      .catch((error) => console.log(error));
  };

  const loadData = async (token, id) => {
    profileUser(token, id)
      .then((res) => {
        console.log(res.data.idcardphoto);
        setData(res.data);
        setAvatarImage(res.data.avatarphoto);
        setIdcardImage(res.data.idcardphoto);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      {loading ? (
        <Stack justifyContent={"center"}>
          <CircularProgress />
          <Typography>กำลังโหลดข้อมูลข้อมูล</Typography>
        </Stack>
      ) : data ? (
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
              <Button variant="outlined" color="error">
                {data.statusVerify}
              </Button>
            )}
            {data.statusVerify === "ตรวจสอบแล้ว" && (
              <Button variant="outlined" color="success">
                {data.statusVerify}
              </Button>
            )}
            {data.statusVerify === "รอแก้ไขข้อมูล" && (
              <Button variant="outlined" color="warning">
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
          {data.role === "owner" && (
            <>
              <Stack direction={"column"} alignItems={"center"}>
                <Typography variant="h6" gutterBottom>
                  ที่อยู่บริษัท
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
                    บ้านเลขที่: {data.companyHouseNumber}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6" gutterBottom>
                    หมู่ที่: {data.companyGroupNumber}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6" gutterBottom>
                    ตำบล: {data.CompanySubDistrict}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6" gutterBottom>
                    อำเภอ: {data.CompanyDistrict}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6" gutterBottom>
                    จังหวัด: {data.CompanyProVince}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6" gutterBottom>
                    รหัสไปรษณีย์: {data.CompanyPostCode}
                  </Typography>
                </Grid>
              </Grid>
            </>
          )}
          <Stack direction={"row"} spacing={2}>
            <Grid container spacing={2} justifyContent={"flex-end"}>
              <Grid item xs={6} xl={3}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">ตรวจสอบ</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={status}
                    label="ตรวจสอบ"
                    onChange={handleChange}
                    disabled={data.statusVerify === "ตรวจสอบแล้ว"}
                  >
                    <MenuItem value={"ตรวจสอบแล้ว"}>ข้อมูลถูกต้อง</MenuItem>
                    <MenuItem value={"รอแก้ไขข้อมูล"}>
                      ข้อมูลไม่ถูกต้อง
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Stack direction={"row"} alignItems={"center"}>
              <Button
                variant="contained"
                onClick={() => onSubmit(localStorage.getItem("token"))}
                disabled={data.statusVerify === "ตรวจสอบแล้ว"}
              >
                บันทึก
              </Button>
            </Stack>
          </Stack>
        </Paper>
      ) : (
        <p>No data available</p>
      )}
    </>
  );
}
