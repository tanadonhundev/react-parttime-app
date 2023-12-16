import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Autocomplete } from "@mui/material";
import { InputLabel } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormControl from "@mui/material/FormControl";

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import toast from "react-hot-toast";

import { Link, useNavigate } from "react-router-dom";

import { profileUser } from "../../../services/user";
import { currentUser } from "../../../services/auth";
import { createCompany } from "../../../services/company";

export default function CompanyCrate() {
  const [companyName, setcompanyName] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkPosition, setSelectedWorkPosition] = useState(null);
  const [role, setRole] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    currentUser(token)
      .then((res) => {
        const id = res.data._id;
        setRole(res.data.role);
        loadData(token, id);
      })
      .catch((error) => console.log(error));
  }, []);

  const loadData = async (token, id) => {
    profileUser(token, id)
      .then((res) => {
        setcompanyName(res.data);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };

  const schema = yup.object().shape({
    workStartTime: yup.date().required(),
    workEndTime: yup.date().required(),
    workBreakTime: yup.number().positive().required(),
    dailyWage: yup.number().positive().required(),
    workScope: yup.string().required(),
    workWelfare: yup.string().required(),
    workDress: yup.string().required(),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    const token = localStorage.getItem("token");
    const value = {
      companyId: companyName._id,
      companyName: companyName.companyName,
      workPosition: selectedWorkPosition,
      workStartTime: data.workStartTime,
      workEndTime: data.workEndTime,
      workBreakTime: data.workBreakTime,
      dailyWage: data.dailyWage,
      workScope: data.workScope,
      workWelfare: data.workWelfare,
      workDress: data.workDress,
    };
    console.log(value);
    createCompany(token, value)
      .then((res) => {
        toast.success(res.data);
        navigate("/dashboard-owner/company-announce");
      })
      .catch((error) => console.log(error));
  };
  return (
    <>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            ประกาศจ้างงาน
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                {companyName.companyName && (
                  <TextField
                    {...register("companyName")}
                    fullWidth
                    disabled
                    label="ชื่อบริษัท"
                    defaultValue={companyName.companyName}
                  />
                )}
              </Grid>
              <Grid item xs={12} sm={12}>
                <Autocomplete
                  {...register("workPosition")}
                  value={selectedWorkPosition}
                  onChange={(event, newValue) => {
                    setSelectedWorkPosition(newValue);
                  }}
                  options={[
                    "เสิร์ฟ",
                    "ล้างจาน",
                    "ครัว",
                    "แพ็คสินค้า",
                    "สต๊อกสินค้า",
                    "คัดแยกสินค้า",
                  ]}
                  renderInput={(params) => (
                    <TextField {...params} label="ตำแหน่ง" fullWidth />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["TimePicker"]}>
                    <TimePicker
                      {...register("workStartTime")}
                      onChange={(newValue) => {
                        setValue("workStartTime", newValue);
                      }}
                      label="เวลาเริ่มงาน"
                      ampm={false}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["TimePicker"]}>
                    <TimePicker
                      {...register("workEndTime")}
                      onChange={(newValue) => {
                        setValue("workEndTime", newValue);
                      }}
                      label="เวลาเลิกงาน"
                      ampm={false}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </Grid>
              <Grid item xs={6} sm={6}>
                <InputLabel>เวลาพัก</InputLabel>
                <FormControl variant="outlined">
                  <OutlinedInput
                    {...register("workBreakTime")}
                    endAdornment={
                      <InputAdornment position="end">ชั่วโมง</InputAdornment>
                    }
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={6}>
                <InputLabel>รายได้</InputLabel>
                <FormControl variant="outlined">
                  <OutlinedInput
                    {...register("dailyWage")}
                    endAdornment={
                      <InputAdornment position="end">
                        บาท/ชั่วโมง
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  {...register("workScope")}
                  label="ขอบเขตการทำงาน"
                  fullWidth
                  multiline
                  rows={4}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  {...register("workWelfare")}
                  label="สวัสดิการ"
                  fullWidth
                  multiline
                  rows={4}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  {...register("workDress")}
                  label="การแต่งกาย"
                  fullWidth
                  multiline
                  rows={4}
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
    </>
  );
}
