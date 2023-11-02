import React, { useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import CameraIcon from "@mui/icons-material/PhotoCamera";

import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";

import { currentUser } from "../../services/auth";

export default function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    currentUser(token)
      .then((res) => {
        const role = res.data.role;
        if (role === "admin") {
          navigate("/dashboard-admin");
        } else if (role === "owner") {
          navigate("/dashboard-owner");
        } else if (role === "employee") {
          navigate("/dashboard-employee");
        } else {
          navigate("/");
        }
      })
      .catch((error) => console.log(error));
  }, []);

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
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: "background.paper",
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              ระบบหางานพาร์ทไทม์
            </Typography>
            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              <Button variant="contained" component={Link} to="/login">
                เข้าสู่ระบบ
              </Button>
              <Button variant="outlined" component={Link} to="/register">
                ลงทะเบียน
              </Button>
            </Stack>
          </Container>
        </Box>
      </main>
    </>
  );
}
