import React, { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { InputLabel } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import "dayjs/locale/th";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";

import toast from "react-hot-toast";

import { profileUser, profileEdit } from "../../../services/user";

import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

const libraries = ["places"];
const mapContainerStyle = {
  width: "100%",
  height: "250px",
};

export default function EditProfile() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markers, setMarkers] = useState([]);
  const [clickedLatLng, setClickedLatLng] = useState({
    lat: parseFloat(data.lat) || 0, // ใช้ค่าที่มีอยู่แล้วหรือค่าเริ่มต้น
    lng: parseFloat(data.lng) || 0, // ใช้ค่าที่มีอยู่แล้วหรือค่าเริ่มต้น
  });
  const [center, setCenter] = useState({
    lat: parseFloat(data.lat) || 0,
    lng: parseFloat(data.lng) || 0,
  });
  const [avatarImage, setAvatarImage] = useState();
  const [idcardImage, setIdcardImage] = useState();

  const baseURL = import.meta.env.VITE_API;

  const params = useParams();
  const navigate = useNavigate();

  const schema = yup.object().shape({
    idCard: yup
      .string()
      .min(13, "เลขบัตรประชาชนต้องมี 13 หลัก")
      .max(13, "เลขบัตรประชาชนต้องมี 13 หลัก"),
    phoneNumber: yup
      .string()
      .min(10, "เบอร์โทรศัพท์ต้องมี 10 หลัก")
      .max(10, "เบอร์โทรศัพท์ต้องมี 10 หลัก"),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });
  useEffect(() => {
    const token = localStorage.getItem("token");
    loadData(token, params.id);
  }, []);

  useEffect(() => {
    if (data.lat && data.lng) {
      setCenter({
        lat: parseFloat(data.lat),
        lng: parseFloat(data.lng),
      });
    }
  }, [data]);

  const onSubmit = async (data) => {
    // ตรวจสอบว่าฟิลด์วันเกิดมีการเปลี่ยนแปลงหรือไม่
    if (data.birthDay !== dayjs(data.birthDay)) {
      // คำนวณอายุ
      const birthDate = dayjs(data.birthDay);
      const currentYear = dayjs().year();
      const birthYear = birthDate.year();
      const age = currentYear - birthYear;
      // Update อายุ
      data.age = age;
    }

    if (clickedLatLng.lat !== 0 && clickedLatLng.lng !== 0) {
      data.lat = clickedLatLng.lat;
      data.lng = clickedLatLng.lng;
    }

    const formData = new FormData();

    // Append avatarphoto and idcardphoto files to the formData
    if (data.avatarphoto[0]) {
      formData.append("avatarphoto", data.avatarphoto[0]);
    } else {
      formData.append("avatarphoto", avatarImage);
    }
    // Append idcardphoto files to the formData
    if (data.idcardphoto[0]) {
      formData.append("idcardphoto", data.idcardphoto[0]);
    } else {
      formData.append("idcardphoto", idcardImage);
    }

    // Append other form data
    for (const key in data) {
      if (key !== "avatarphoto" && key !== "idcardphoto") {
        formData.append(key, data[key]);
      }
    }

    profileEdit(params.id, formData)
      .then((res) => {
        navigate("/dashboard-employee/profile");
        toast.success(res.data.message);
      })
      .catch((error) => console.log(error));
  };

  const loadData = async (token, id) => {
    profileUser(token, id)
      .then((res) => {
        setData(res.data);
        setAvatarImage(res.data.avatarphoto);
        setIdcardImage(res.data.idcardphoto);
        setLoading(false);
        setMarkers([
          { lat: parseFloat(res.data.lat), lng: parseFloat(res.data.lng) },
        ]);
      })
      .catch((error) => console.log(error));
  };

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyBk7hWPDP_TF3J_FsnRaDC8JHOSElW9Ayk",
    libraries,
  });

  const handleMapClick = (e) => {
    setClickedLatLng({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    });
  };

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";

  return (
    <>
      {loading ? (
        <Stack alignItems={"center"}>
          <CircularProgress />
          <Typography>กำลังโหลดข้อมูลข้อมูล</Typography>
        </Stack>
      ) : (
        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar
              sx={{ width: 150, height: 150 }}
              alt="Remy Sharp"
              src={`${baseURL}/uploads/avatar/` + avatarImage}
            />
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit(onSubmit)}
              encType="multipart/form-data"
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
                        setValue("birthDay", newValue);

                        // คำนวณอายุโดยลบปีเกิดจากปีปัจจุบัน
                        const currentYear = dayjs().year();
                        const birthYear = birthDate.year();
                        const age = currentYear - birthYear;

                        // กำหนดค่าอายุใน TextField ของอายุ
                        setValue("age", age);
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
                    {...register("idCard")}
                    error={errors.idCard ? true : false}
                    helperText={errors.idCard && errors.idCard.message}
                    fullWidth
                    label="เลขบัตรประชาชน"
                    defaultValue={data.idCard}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    {...register("phoneNumber")}
                    error={errors.phoneNumber ? true : false}
                    helperText={
                      errors.phoneNumber && errors.phoneNumber.message
                    }
                    fullWidth
                    label="เบอร์โทรศัพท์"
                    defaultValue={data.phoneNumber}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel>ที่อยู่ปัจจุบัน</InputLabel>
                  <Card>
                    <CardContent>
                      <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        zoom={15}
                        center={center}
                        onClick={handleMapClick}
                      >
                        {clickedLatLng.lat !== 0 && clickedLatLng.lng !== 0 && (
                          <Marker
                            position={{
                              lat: clickedLatLng.lat,
                              lng: clickedLatLng.lng,
                            }}
                          />
                        )}
                        {markers.map((marker, index) => (
                          <Marker
                            key={index}
                            position={{ lat: marker.lat, lng: marker.lng }}
                          />
                        ))}
                      </GoogleMap>
                    </CardContent>
                  </Card>
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
