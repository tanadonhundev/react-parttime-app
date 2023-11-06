import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";

import { useNavigate, useParams } from "react-router-dom";

import { currentUser } from "../../../services/auth";
import { workDescrip, applyWork } from "../../../services/work";

export default function WorkDescrip() {
  const [company, setCompany] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const params = useParams();


  useEffect(() => {
    const token = localStorage.getItem("token");
    loadData(token,params.id);
    currentUser(token)
      .then((res) => {
        setData(res.data);
      })
      .catch((error) => console.log(error));
  }, []);

  const loadData = async (token, id) => {
    workDescrip(token, id)
      .then((res) => {
        setCompany(res.data[0]);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };

  const onSubmit = async () => {
    const token = localStorage.getItem("token");
    const value = {
      employee: data,
      company: company,
    };
    applyWork(token, value)
      .then((res) => {
        //console.log(res);
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      <div>work-details</div>
      <Box
        component="form"
        noValidate
        onSubmit={onSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
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
              ชื่่อ: {company.companyName}
            </Typography>
            <Typography variant="h6" gutterBottom>
              ตำแหน่ง: {company.workPosition}
            </Typography>
            <Typography variant="h6" gutterBottom>
              เวลาเรื่มงาน: {company.workStartTime}
            </Typography>
            <Typography variant="h6" gutterBottom>
              เวลาเลิกงาน: {company.workEndTime}
            </Typography>
            <Typography variant="h6" gutterBottom>
              เวลาพัก: {company.workBreakTime}ชั่วโมง
            </Typography>
            <Typography variant="h6" gutterBottom>
              รายได้: {company.dailyWage}บาท/ชั่วโมง
            </Typography>
          </Box>
        ) : (
          <p>No data available</p>
        )}
        <Button onClick={onSubmit}>สมัครงาน</Button>
      </Box>
    </>
  );
}
