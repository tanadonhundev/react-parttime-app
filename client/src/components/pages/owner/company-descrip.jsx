import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { InputLabel } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormControl from "@mui/material/FormControl";
import Badge from "@mui/material/Badge";
import AddCircleIcon from "@mui/icons-material/AddCircle";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";

import dayjs from "dayjs";
import "dayjs/locale/th";
dayjs.locale("th");

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";

import { companyDescrip } from "../../../services/company";
import { postWork } from "../../../services/work";

function ServerDay(props) {
  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

  const isSelected =
    !outsideCurrentMonth &&
    highlightedDays.some((highlightedDay) => highlightedDay.isSame(day, "day"));

  return (
    <Badge
      key={day.toString()}
      overlap="circular"
      badgeContent={
        isSelected ? (
          <AddCircleIcon style={{ color: "darkorange" }} />
        ) : undefined
      }
    >
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
      />
    </Badge>
  );
}

export default function CompanyDescrip() {
  const [company, setCompany] = useState([]);
  const [loading, setLoading] = useState(true);
  const [highlightedDays, setHighlightedDays] = useState([]);

  const params = useParams();
  const navigate = useNavigate();

  const schema = yup.object().shape({
    workDay: yup.array().of(yup.date()).required("เลือกวันที่ด้วย").nullable(),
    numOfEmployee: yup.number().required("จำนวนที่เปิดรับ ห้ามเป็นค่าว่าง"),
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

  const loadData = async (token, id) => {
    companyDescrip(token, id)
      .then((res) => {
        setCompany(res.data);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };

  const handleDateChange = (newValues) => {
    // แปลงวันที่ที่เลือก
    const date = dayjs(newValues);

    //ตรวจสอบว่าวันที่อยู่ในอาร์เรย์วันที่เน้นแล้วหรือไม่
    const dateIndex = highlightedDays.findIndex((day) =>
      day.isSame(date, "day")
    );

    // สร้างอาร์เรย์ใหม่พร้อมวันที่ไฮไลต์ที่อัปเดต
    let updatedHighlightedDays;

    if (dateIndex === -1) {
      // หากวันที่ไม่อยู่ในอาร์เรย์ ให้เพิ่มเข้าไป
      updatedHighlightedDays = [...highlightedDays, date];
    } else {
      // หากมีวันที่อยู่ในอาร์เรย์อยู่แล้ว ให้ลบออก
      updatedHighlightedDays = [...highlightedDays];
      updatedHighlightedDays.splice(dateIndex, 1);
    }
    // อัปเดตสถานะวันที่ไฮไลต์(เป็นข้อมูลแบบ array)
    setHighlightedDays(updatedHighlightedDays);
    setValue("workDay", updatedHighlightedDays);

    //console.log("Selected Dates:", updatedHighlightedDays);
  };

  const onSubmit = async (data) => {
    const token = localStorage.getItem("token");
    const value = {
      companyId: company.companyId,
      companyName: company.companyName,
      workPosition: company.workPosition,
      workStartTime: company.workStartTime,
      workEndTime: company.workEndTime,
      workBreakTime: company.workBreakTime,
      dailyWage: company.dailyWage,
      numOfEmployee: data.numOfEmployee,
      workScope: company.workScope,
      workWelfare: company.workWelfare,
      workDress: company.workDress,
      workDay: highlightedDays,
      companyphoto: company.companyphoto,
    };
    console.log(value);
    postWork(token, value)
      .then((res) => {
        //console.log(res);
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

  return (
    <>
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
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
              เวลาเรื่มงาน:
              {dayjs(company.workStartTime).locale("th").format("HH:mm")}
            </Typography>
            <Typography variant="h6" gutterBottom>
              เวลาเลิกงาน:
              {dayjs(company.workEndTime).locale("th").format("HH:mm")}
            </Typography>
            <Typography variant="h6" gutterBottom>
              เวลาพัก: {company.workBreakTime}ชั่วโมง
            </Typography>
            <Typography variant="h6" gutterBottom>
              รายได้: {company.dailyWage}บาท/ชั่วโมง
            </Typography>
            <Typography variant="h6" gutterBottom>
              ระยะเวลาการทำงาน: {workDuration}
            </Typography>
            <Typography variant="h6" gutterBottom>
              รายได้รวม: {income}บาท/วัน
            </Typography>
            <Grid item xs={6} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar
                  {...register("workDay")}
                  onChange={(newValues) => {
                    const date = dayjs(newValues);
                    setValue("workDay", date);
                    handleDateChange(date);
                  }}
                  minDate={dayjs()}
                  maxDate={dayjs().add(13, "days")}
                  slots={{
                    day: ServerDay,
                  }}
                  slotProps={{
                    day: {
                      highlightedDays,
                    },
                  }}
                />
                {errors.workDay && (
                  <p style={{ color: "red" }}>{errors.workDay.message}</p>
                )}
              </LocalizationProvider>
            </Grid>
            <Grid item xs={6} sm={6}>
              <InputLabel>จำนวนที่เปิดรับ</InputLabel>
              <FormControl variant="outlined">
                <OutlinedInput
                  {...register("numOfEmployee")}
                  endAdornment={
                    <InputAdornment position="end">คน</InputAdornment>
                  }
                />
              </FormControl>
            </Grid>
          </Box>
        ) : (
          <p>No data available</p>
        )}
        <Button type="submit">ประกาศจ้างงาน</Button>
      </Box>
    </>
  );
}
