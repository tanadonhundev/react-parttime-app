import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";

import dayjs from "dayjs";
import toast from "react-hot-toast";

import { useNavigate, useParams } from "react-router-dom";

import { currentUser } from "../../../services/auth";
import { workDescrip, applyWork } from "../../../services/work";
import { profileUser } from "../../../services/user";

import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

const libraries = ["places"];
const mapContainerStyle = {
  width: "100%",
  height: "250px",
};

export default function WorkDescrip() {
  const [company, setCompany] = useState([]);
  const [data, setData] = useState([]);
  const [lntlng, setLntlng] = useState([]);
  const [companyId, setCompanyId] = useState();
  const [companyImage, setcompanyImage] = useState();
  const [loading, setLoading] = useState(true);
  const [markers, setMarkers] = useState([]);

  const baseURL = import.meta.env.VITE_API;

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyBk7hWPDP_TF3J_FsnRaDC8JHOSElW9Ayk", // Replace with your Google Maps API key
    libraries,
  });

  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    currentUser(token)
      .then((res) => {
        setData(res.data);
        loadData(token, params.id);
      })
      .catch((error) => console.log(error));
  }, [params.id]);

  const loadData = async (token, id) => {
    workDescrip(token, id)
      .then((res) => {
        const companyData = res.data[0];
        if (companyData) {
          setCompany(companyData);
          setCompanyId(companyData.companyId);
          loadDataCompany(token, companyData.companyId);
          setLoading(false);
        } else {
          setLoading(false);
        }
      })
      .catch((error) => console.log(error));
  };

  const loadDataCompany = async (token, id) => {
    if (id) {
      profileUser(token, id)
        .then((res) => {
          setcompanyImage(res.data.companyphoto);
          setLntlng(res.data);
          setMarkers([
            { lat: parseFloat(res.data.lat), lng: parseFloat(res.data.lng) },
          ]);
        })
        .catch((error) => console.log(error));
    }
  };

  const onSubmit = async () => {
    const token = localStorage.getItem("token");
    const value = {
      employee: data,
      company: company,
    };
    applyWork(token, value)
      .then((res) => {
        if (res.data === "สมัครงานสำเร็จ") {
          toast.success(res.data);
          navigate("/dashboard-employee/work-announce");
        } else {
          toast.error(res.data);
          navigate("/dashboard-employee/work-announce");
        }
      })
      .catch((error) => console.log(error));
  };

  const startTime = dayjs(company.workStartTime);
  const endTime = dayjs(company.workEndTime);
  const breakTime = company.workBreakTime;
  const dailyWage = company.dailyWage;

  // คำนวณระยะเวลาเป็นชั่วโมงและนาที
  var duration = endTime.diff(startTime, "minute");

  if (duration < 0) {
    duration = duration + 24 * 60;
  }

  // แปลงเวลาพักจากชั่วโมงเป็นนาทีแล้วลบออก
  const breakTimeInMinutes = breakTime * 60;
  const durationWithoutBreak = duration - breakTimeInMinutes;

  // คำนวณชั่วโมงและนาทีหลังจากลบเวลาพัก
  const hoursWithoutBreak = Math.floor(durationWithoutBreak / 60);
  const minutesWithoutBreak = durationWithoutBreak % 60;
  const income = hoursWithoutBreak * dailyWage;

  // Format ผลลัพธ์
  const workDuration = `${hoursWithoutBreak} ชั่วโมง ${minutesWithoutBreak} นาที`;

  const center = {
    lat: parseFloat(lntlng.lat),
    lng: parseFloat(lntlng.lng),
  };

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";

  const openGoogleMaps = () => {
    const emLat = parseFloat(data.lat);
    const emLng = parseFloat(data.lng);
    const ownerLat = parseFloat(lntlng.lat);
    const ownerLng = parseFloat(lntlng.lng);
    const googleMapsUrl = `https://www.google.com/maps/dir/${emLat},${emLng}/${ownerLat},${ownerLng}`;
    window.open(googleMapsUrl, "_blank");
  };

  return (
    <>
      {loading ? (
        <Stack alignItems={"center"}>
          <CircularProgress />
          <Typography>กำลังโหลดข้อมูลข้อมูล</Typography>
        </Stack>
      ) : (
        <Paper
          style={{
            padding: 16,
            marginBottom: 16,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            borderRadius: 8,
            background: "#fff",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {loading ? (
              <p>Loading...</p>
            ) : company ? (
              <Box
                sx={{
                  width: "100%",
                  maxWidth: 500,
                  textAlign: "start",
                  padding: 2,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  รายละเอียดการจ้างงาน
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {company.companyName}
                </Typography>
                <Card sx={{ maxWidth: 500 }}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="140"
                      src={`${baseURL}/uploads/company/` + companyImage}
                      alt="Company Image"
                    />
                  </CardActionArea>
                </Card>
                <br />
                <Stack direction={"column"}>
                  <Typography variant="h7" gutterBottom>
                    ตำแหน่ง: พนักงาน{company.workPosition}
                  </Typography>
                  <Typography variant="h7" gutterBottom>
                    รายได้ต่อชั่วโมง {company.dailyWage.toFixed(2)} บาท/ชั่วโมง
                  </Typography>
                  <Typography variant="h7" gutterBottom>
                    รายได้รวม {income.toFixed(2)} บาท/วัน
                  </Typography>
                </Stack>
              </Box>
            ) : (
              <p>No data available</p>
            )}
            <Box
              sx={{
                width: "100%",
                maxWidth: 500,
                textAlign: "start",
                padding: 2,
              }}
            >
              <Typography variant="h6" gutterBottom>
                รายละเอียด
              </Typography>
              <Box>
                <Stack direction={"column"}>
                  <Typography variant="h7" gutterBottom>
                    วัน:{" "}
                    {dayjs(company.workDay)
                      .locale("th")
                      .format("ddd DD MMM YYYY")}
                  </Typography>
                  <Typography variant="h7" gutterBottom>
                    เวลา:{" "}
                    {dayjs(company.workStartTime).locale("th").format("HH:mm")}-
                    {dayjs(company.workEndTime).locale("th").format("HH:mm")}
                  </Typography>
                  <Typography variant="h7" gutterBottom>
                    ทำงาน: {workDuration}
                  </Typography>
                  <Typography variant="h7" gutterBottom>
                    เวลาพัก: {company.workBreakTime} ชั่วโมง
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    ขอบเขตการทำงาน
                  </Typography>
                  <Typography variant="h7" gutterBottom>
                    <div style={{ whiteSpace: "pre-line" }}>
                      {company.workScope}
                    </div>
                  </Typography>
                </Stack>
              </Box>
              <Card>
                <CardContent>
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    zoom={15}
                    center={center}
                  >
                    {markers.map((marker, index) => (
                      <Marker
                        key={index}
                        position={{ lat: marker.lat, lng: marker.lng }}
                      />
                    ))}
                  </GoogleMap>
                </CardContent>
                <Stack alignItems={"flex-end"}>
                  <Button
                    variant="contained"
                    color="warning"
                    onClick={openGoogleMaps}
                  >
                    เปิดแผนที่
                  </Button>
                </Stack>
              </Card>
            </Box>
            <Box
              sx={{
                width: "100%",
                maxWidth: 500,
                textAlign: "start",
                padding: 2,
              }}
            >
              <Typography variant="h6" gutterBottom>
                สวัสดิการ
              </Typography>
              <Typography variant="h7" gutterBottom>
                <div style={{ whiteSpace: "pre-line" }}>
                  {company.workWelfare}
                </div>
              </Typography>
              <Typography variant="h6" gutterBottom>
                การแต่งกาย
              </Typography>
              <Typography variant="h7" gutterBottom>
                <div style={{ whiteSpace: "pre-line" }}>
                  {company.workDress}
                </div>
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              textAlign: "start",
              padding: 2,
            }}
          >
            <Stack alignItems={"flex-end"}>
              <Button variant="contained" color="success" onClick={onSubmit}>
                สมัครงาน
              </Button>
            </Stack>
          </Box>
          <br></br>
        </Paper>
      )}
    </>
  );
}
