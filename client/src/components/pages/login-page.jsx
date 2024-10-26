import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import CameraIcon from "@mui/icons-material/PhotoCamera";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import CircularProgress from "@mui/material/CircularProgress";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import toast from "react-hot-toast";
import { loginUser } from "../../services/auth";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const schema = yup.object().shape({
    email: yup
      .string()
      .required("ป้อนอีเมล์ด้วย")
      .email("รูปแบบอีเมล์ไม่ถูกต้อง"),
    password: yup
      .string()
      .required("ป้อนรหัสผ่านด้วย")
      .min(6, "รหัสผ่านต้องอย่างน้อย 6 ตัวอักษรขึ้นไป"),
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
    loginUser(data)
      .then((res) => {
        setLoading(false);
        localStorage.setItem("token", res.data.token);
        roleUser(res.data.payload.user.role);
        toast.success("เข้าสู่ระบบสำเร็จ");
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
        toast.error(error.response.data);
      });
  };

  const roleUser = (role) => {
    if (role === "admin") {
      navigate("/dashboard-admin/manage-user");
    } else if (role === "owner") {
      navigate("/dashboard-owner/company-announce");
    } else if (role === "employee") {
      navigate("/dashboard-employee/work-announce");
    }
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
            เข้าสู่ระบบ
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
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
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              Log In
            </Button>
            <Grid container justifyContent="center" spacing={3}>
              <Grid item>
                <Link href="/" variant="body2">
                  กลับหน้าหลัก
                </Link>
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
