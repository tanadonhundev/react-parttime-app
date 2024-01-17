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

import { profileUser, statusVerify } from "../../../services/user";
import dayjs from "dayjs";
import "dayjs/locale/th";

import { Link, useNavigate, useParams } from "react-router-dom";

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
        setData(res.data);
        setAvatarImage(res.data.avatarphoto);
        setIdcardImage(res.data.idcardphoto);
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

              <Typography variant="h6" gutterBottom>
                ชื่อ: {data.firstName}
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
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  สถานนะตรวจสอบ
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={status}
                  label="สถานนะตรวจสอบ"
                  onChange={handleChange}
                >
                  <MenuItem value={"ตรวจสอบแล้ว"}>ตรวจสอบแล้ว</MenuItem>
                  <MenuItem value={"ยังไม่ได้ตรวจสอบ"}>
                    ยังไม่ได้ตรวจสอบ
                  </MenuItem>
                </Select>
              </FormControl>
              <Stack alignItems={"flex-end"}>
                <Button onClick={() => onSubmit(localStorage.getItem("token"))}>
                  บันทึก
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
