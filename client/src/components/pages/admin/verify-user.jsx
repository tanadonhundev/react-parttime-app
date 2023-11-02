import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";

import { profileUser, statusVerify } from "../../../services/user";
import dayjs from "dayjs";
import "dayjs/locale/th";

import { useNavigate, useParams } from "react-router-dom";
import { Stack } from "@mui/material";

export default function VerifyUser() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

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
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      <Paper elevation={3} style={{ padding: "20px" }}>
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
              <Avatar sx={{ width: 150, height: 150 }}>M</Avatar>
              <Stack direction={"row"} spacing={2}>
                <Typography variant="h6" gutterBottom>
                  ชื่่อ: {data.firstName}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  นามสกุล: {data.lastName}
                </Typography>
              </Stack>
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
            </Box>
          ) : (
            <p>No data available</p>
          )}
          <Button onClick={() => onSubmit(localStorage.getItem("token"))}>
            บันทึก
          </Button>
        </Box>
      </Paper>
    </>
  );
}
