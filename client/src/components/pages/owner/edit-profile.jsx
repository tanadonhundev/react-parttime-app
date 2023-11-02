import React, { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { InputLabel } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";

import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import "dayjs/locale/th";

import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import toast from "react-hot-toast";

import { profileUser, profileEdit } from "../../../services/user";

export default function EditProfile() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const navigate = useNavigate();

  //console.log(params.id);

  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    const token = localStorage.getItem("token");
    loadData(token,params.id);
  }, []);

  const onSubmit = async (data) => {
    //console.log(data);
    profileEdit(params.id, data)
      .then((res) => {
        navigate("/dashboard-owner/profile");
        toast.success(res.data.message);
      })
      .catch((error) => console.log(error));
  };

  const loadData = async (token,id) => {
    profileUser(token,id)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ width: 150, height: 150 }}></Avatar>
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
                    fullWidth
                    label="ชื่อ"
                    defaultValue={data.firstName}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    {...register("lastName")}
                    fullWidth
                    label="นามสกุล"
                    defaultValue={data.lastName}
                  />
                </Grid>
                <Grid item xs={12} sm={7}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      {...register("birthDay")}
                      onChange={(newValue) => {
                        const birthDate = dayjs(newValue);
                        const currentYear = dayjs().year();
                        const birthYear = birthDate.year();
                        const age = currentYear - birthYear;

                        if (birthYear <= currentYear) {
                          setValue("birthDay", newValue);
                          setValue("age", age);
                        } else {
                          // ไม่อนุญาตให้เลือกวันที่ในอนาคต
                          toast.error("ไม่สามารถเลือกวันที่ในอนาคต");
                        }
                      }}
                      label="วันเดือนปีเกิด"
                      format="DD/MM/YYYY"
                      defaultValue={dayjs(data.birthDay)}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={5}>
                  <TextField
                    {...register("age")}
                    defaultValue={data.age}
                    disabled
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">อายุ</InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    {...register("companyName")}
                    fullWidth
                    label="ชื่อบริษัท"
                    defaultValue={data.companyName}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    {...register("idCard")}
                    fullWidth
                    label="เลขบัตรประชาชน"
                    defaultValue={data.idCard}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    {...register("phoneNumber")}
                    fullWidth
                    label="เบอร์โทรศัพท์"
                    defaultValue={data.phoneNumber}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel>รูปประจำตัว</InputLabel>
                  <TextField
                    fullWidth
                    {...register("avatarphoto")}
                    accept="image/*"
                    multiple
                    type="file"
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel>รูปบัตรประชาชน</InputLabel>
                  <TextField
                    fullWidth
                    {...register("idcardphoto")}
                    accept="image/*"
                    multiple
                    type="file"
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                บันทึก
              </Button>
            </Box>
          </Box>
        </Container>
      )}
    </>
  );
}
