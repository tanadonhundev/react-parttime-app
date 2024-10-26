import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import CameraIcon from "@mui/icons-material/PhotoCamera";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import CircularProgress from "@mui/material/CircularProgress";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

import FormLabel from "@mui/material/FormLabel";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import toast from "react-hot-toast";
import { registerUser } from "../../services/auth";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const schema = yup.object().shape({
    firstName: yup.string().required("ป้อนข้อมูลชื่อด้วย"),
    lastName: yup.string().required("ป้อนข้อมูลนามสกุลด้วย"),
    email: yup
      .string()
      .required("ป้อนอีเมลด้วย")
      .email("รูปแบบอีเมลไม่ถูกต้อง"),
    password: yup
      .string()
      .required("ป้อนรหัสผ่านด้วย")
      .min(6, "รหัสผ่านต้องอย่างน้อย 6 ตัวอักษรขึ้นไป"),
    role: yup.string().required(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });

  const onSubmit = async (data) => {
    setLoading(true);
    registerUser(data)
      .then((res) => {
        toast.success(res.data);
        navigate("/");
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
        toast.error(error.response.data);
      });
  };

  return (
    <>
      <AppBar position="relative">
        <Toolbar>
          <CameraIcon sx={{ mr: 2 }} />
          <Typography variant="h6" color="inherit" noWrap>
            ระบบหางานพาร์ทไทม์
          </Typography>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            ลงทะเบียนผู้ใช้ใหม่
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  {...register("firstName")}
                  error={errors.firstName ? true : false}
                  helperText={errors.firstName && errors.firstName.message}
                  fullWidth
                  label="First Name"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  {...register("lastName")}
                  error={errors.lastName ? true : false}
                  helperText={errors.lastName && errors.lastName.message}
                  fullWidth
                  label="Last Name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  {...register("email")}
                  error={errors.email ? true : false}
                  helperText={errors.email && errors.email.message}
                  fullWidth
                  label="Email Address"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  {...register("password")}
                  error={errors.password ? true : false}
                  helperText={errors.password && errors.password.message}
                  fullWidth
                  label="Password"
                  type="password"
                />
              </Grid>
              <Grid item xs={12}>
                <FormLabel id="demo-row-radio-buttons-group-label">
                  ตำแหน่ง
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="role"
                >
                  <FormControlLabel
                    {...register("role")}
                    value="owner"
                    control={<Radio />}
                    label="นายจ้าง"
                  />
                  <FormControlLabel
                    {...register("role")}
                    value="employee"
                    control={<Radio />}
                    label="ลูกจ้าง"
                  />
                </RadioGroup>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              ลงทะเบียน
            </Button>
            <Grid container justifyContent="center" spacing={3}>
              <Grid item>
                <Button href="/" variant="text">
                  กลับหน้าหลัก
                </Button>
              </Grid>
              <Grid item>
                <Button href="/login" variant="text">
                  ถ้าลงทะเบียนแล้ว ไปที่หน้า Log In
                </Button>
              </Grid>
            </Grid>
          </Box>
          {
            loading && (
              <CircularProgress />
            ) /* Show loading indicator while isLoading is true */
          }
        </Box>
      </Container>
    </>
  );
}
