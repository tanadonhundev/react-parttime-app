import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import CircularProgress from "@mui/material/CircularProgress";

import BadgeIcon from "@mui/icons-material/Badge";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import CancelIcon from "@mui/icons-material/Cancel";

import { Link } from "react-router-dom";

import toast from "react-hot-toast";

import dayjs from "dayjs";
import "dayjs/locale/th";

import {
  applyList,
  workList,
  ChangeEmploymentStatus,
  CancelWork,
} from "../../../services/work";
import { currentUser } from "../../../services/auth";
import { loadPhoto, profileUser } from "../../../services/user";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function WorkApply() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);
  const [companyId, setCompanyId] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState("");
  const [userToCancel, setUserToCancel] = useState([]);
  const [countdowns, setCountdowns] = useState({});
  const [employeeId, setEmployeeId] = useState();

  const baseURL = import.meta.env.VITE_API;

  useEffect(() => {
    const token = localStorage.getItem("token");
    currentUser(token)
      .then((res) => {
        const id = res.data._id;
        loadData(token, id);
        loadDataCompany(token);
        loadDataEmployee(token, id);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    const currentDate = dayjs();
    const datesWithData = data.filter((item) =>
      dayjs(item.workDay).isAfter(currentDate.subtract(1, "day"), "day")
    );
    const selectedDate = uniqueDates[selectedTab];
    const filteredByDate = datesWithData.filter((item) =>
      dayjs(item.workDay).isSame(selectedDate, "day")
    );
    setFilteredData(filteredByDate);
  }, [data, selectedTab]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (companyId.length > 0) {
      loadDataOwner(token);
    }
  }, [companyId]);

  const updateCountdowns = () => {
    const now = dayjs();
    const newCountdowns = {};

    filteredData.forEach((item) => {
      const workDay = dayjs(item.workDay);
      const timeDiff = workDay.diff(now, "second");
      const countdown = Math.max(0, timeDiff); // Ensure countdown is not negative

      const hours = Math.floor(countdown / 3600);
      const minutes = Math.floor((countdown % 3600) / 60);
      const seconds = countdown % 60;

      newCountdowns[item._id] = { hours, minutes, seconds };
    });

    setCountdowns(newCountdowns);
  };

  useEffect(() => {
    const intervalId = setInterval(updateCountdowns, 1000);
    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [filteredData]);

  const loadData = async (token, id) => {
    applyList(token, id)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  const loadDataCompany = async (token) => {
    workList(token)
      .then((res) => {
        const companyIdArray = res.data.map((item) => item.companyId);
        const uniqueCompanyIdArray = Array.from(new Set(companyIdArray));
        setCompanyId(uniqueCompanyIdArray);
      })
      .catch((error) => console.log(error));
  };

  const loadDataEmployee = async (token, id) => {
    profileUser(token, id)
      .then((res) => {
        setEmployeeId(res.data._id);
      })
      .catch((error) => console.log(error));
  };

  const loadDataOwner = (token) => {
    const promises = companyId.map((id) => {
      return loadPhoto(token, id)
        .then((res) => ({ id, image: res.data.companyphoto }))
        .catch((error) => console.log(error));
    });

    Promise.all(promises)
      .then((images) => {
        const imagesMap = images.reduce((acc, { id, image }) => {
          acc[id] = image;
          return acc;
        }, {});

        setImage(imagesMap);
      })
      .catch((error) => console.log(error));
  };

  const handleConfirm = (employeeId, companyId, workDay) => {
    const token = localStorage.getItem("token");
    const values = {
      employeeId: employeeId,
      companyId: companyId,
      workDay: workDay,
      status: "พร้อมเริ่มงาน",
    };
    ChangeEmploymentStatus(token, values)
      .then((res) => {
        loadData(token, employeeId);
        toast.success("ยืนยันสมัครงานสำเร็จ");
      })
      .catch((error) => console.log(error));
  };

  const handleCancel = async (token) => {
    if (userToCancel) {
      const filteredEmploymentStatus = userToCancel.employees.find(
        (employee) => employee.employeeId === employeeId
      );
      if (filteredEmploymentStatus) {
        const values = {
          workDay: userToCancel.workDay,
          companyId: userToCancel.companyId,
          employeeId: employeeId,
          employmentStatus: filteredEmploymentStatus.employmentStatus,
        };
        CancelWork(token, values)
          .then((res) => {
            toast.success(res.data);
            handleClose();
            loadData(token, employeeId);
          })
          .catch((error) => console.log(error));
      }
    }
  };

  const currentDate = dayjs();
  // Filter out dates with no data
  const datesWithData = data.filter((item) =>
    dayjs(item.workDay).isAfter(currentDate.subtract(1, "day"), "day")
  );

  // Extract unique dates from the filtered data
  const uniqueDates = Array.from(
    new Set(datesWithData.map((item) => item.workDay))
  );

  uniqueDates.sort((a, b) => (dayjs(a).isBefore(dayjs(b)) ? -1 : 1));

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleClickOpen = (user) => {
    setUserToCancel(user);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setUserToCancel(null);
  };

  return (
    <>
      <Box component="form" noValidate>
        <Typography variant="h6" gutterBottom>
          งานที่สมัคร
        </Typography>
        <Tabs
          value={selectedTab}
          variant="scrollable"
          scrollButtons="auto"
          onChange={handleTabChange}
        >
          {uniqueDates.map((date, index) => (
            <Tab
              key={index}
              label={dayjs(date).locale("th").format("ddd DD MMM")}
            />
          ))}
        </Tabs>
      </Box>
      <Stack spacing={{ xl: 1, sm: 2, md: 4 }} justifyContent="center">
        {loading ? (
          <Stack alignItems={"center"}>
            <CircularProgress />
            <Typography>กำลังโหลดข้อมูลข้อมูล</Typography>
          </Stack>
        ) : (
          <>
            {filteredData.length === 0 ? (
              <Stack alignItems={"center"}>
                <Typography variant="h6">ยังไม่มีงานที่สมัคร</Typography>
              </Stack>
            ) : (
              <Grid container spacing={2}>
                {filteredData.map((item) => (
                  <Grid key={item._id} item lg={3} md={6} sm={12}>
                    <div key={item._id}>
                      {/* Display the countdown for each item */}
                      <Typography variant="body1">
                        Countdown: {countdowns[item._id]?.hours || 0} hours,
                        {countdowns[item._id]?.minutes || 0} minutes,
                        {countdowns[item._id]?.seconds || 0} seconds
                      </Typography>
                    </div>
                    <Card sx={{ maxWidth: 350 }}>
                      <CardActionArea>
                        <CardMedia
                          component="img"
                          height="140"
                          src={`${baseURL}/uploads/company/${
                            image[item.companyId]
                          }`}
                          alt="Company Image"
                        />
                        <CardContent>
                          <Stack direction={"column"} spacing={1}>
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              alignItems="flex-start"
                            >
                              <Typography
                                gutterBottom
                                variant="h5"
                                component="div"
                              >
                                {item.companyName}
                              </Typography>
                              <Button
                                component={Link}
                                to={`/dashboard-employee/work-descrip/${item._id}`}
                                variant="contained"
                                color="success"
                              >
                                ดูข้อมูล
                              </Button>
                            </Stack>
                            <Stack direction={"column"} spacing={1}>
                              <Stack direction={"row"}>
                                <AccessTimeIcon />
                                <Typography variant="body1">
                                  {dayjs(item.workStartTime)
                                    .locale("th")
                                    .format("HH:mm")}
                                </Typography>
                                <Typography variant="body1">-</Typography>
                                <Typography variant="body1">
                                  {dayjs(item.workEndTime)
                                    .locale("th")
                                    .format("HH:mm")}{" "}
                                  น.
                                </Typography>
                              </Stack>
                              <Stack direction={"row"}>
                                <LocalAtmIcon />
                                <Typography variant="body1">
                                  {item.dailyWage} บาท/ชั่วโมง
                                </Typography>
                              </Stack>
                              <Stack direction={"row"}>
                                <Chip
                                  icon={<BadgeIcon />}
                                  label={item.workPosition}
                                  color="info"
                                  variant="outlined"
                                />
                              </Stack>
                            </Stack>
                            <Stack
                              direction={"row"}
                              justifyContent={"space-between"}
                            >
                              {item.employees.map((employee) => {
                                if (employee.employeeId === employeeId) {
                                  return (
                                    <React.Fragment key={employee.employeeId}>
                                      {employee.employmentStatus ===
                                      "รอคัดเลือก" ? (
                                        <Button
                                          variant="outlined"
                                          color="warning"
                                        >
                                          {employee.employmentStatus}
                                        </Button>
                                      ) : employee.employmentStatus ===
                                        "ตำแหน่งเต็ม" ? (
                                        <Button
                                          variant="outlined"
                                          color="error"
                                        >
                                          {employee.employmentStatus}
                                        </Button>
                                      ) : employee.employmentStatus ===
                                        "พร้อมเริ่มงาน" ? (
                                        <Button
                                          variant="outlined"
                                          color="success"
                                        >
                                          {employee.employmentStatus}
                                        </Button>
                                      ) : null}

                                      {employee.employmentStatus ===
                                      "รอคัดเลือก" ? (
                                        <Button
                                          variant="contained"
                                          color="error"
                                          startIcon={<CancelIcon />}
                                          onClick={() => handleClickOpen(item)}
                                        >
                                          ยกเลิก
                                        </Button>
                                      ) : employee.employmentStatus ===
                                        "ตำแหน่งเต็ม" ? (
                                        <Button
                                          component={Link}
                                          to={`/dashboard-employee/work-announce`}
                                          variant="contained"
                                          color="warning"
                                        >
                                          หางานใหม่
                                        </Button>
                                      ) : employee.employmentStatus ===
                                        "พร้อมเริ่มงาน" ? (
                                        <Button
                                          variant="contained"
                                          color="error"
                                          startIcon={<CancelIcon />}
                                          onClick={() => handleClickOpen(item)}
                                        >
                                          ยกเลิก
                                        </Button>
                                      ) : (
                                        <Button
                                          variant="contained"
                                          onClick={() =>
                                            handleConfirm(
                                              employee.employeeId,
                                              item.companyId,
                                              item.workDay
                                            )
                                          }
                                          color="success"
                                        >
                                          ยืนยัน
                                        </Button>
                                      )}
                                    </React.Fragment>
                                  );
                                } else {
                                  return null;
                                }
                              })}
                            </Stack>
                          </Stack>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}
      </Stack>
      <div>
        <Dialog
          open={open}
          TransitionComponent={Transition}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          PaperProps={{ style: { width: "1000px" } }}
        >
          <DialogTitle>{"ยืนยันการยกเลิกสมัครงาน"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {userToCancel && (
                <Stack>
                  <span>{userToCancel.companyName}</span>
                  <span>{userToCancel.employee}</span>
                  <span>
                    วันที่:
                    {dayjs(userToCancel.workDay)
                      .locale("th")
                      .format("ddd DD MMM")}
                  </span>
                  <span>ตำแหน่ง:{userToCancel.workPosition}</span>
                </Stack>
              )}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              color="warning"
              startIcon={<NotInterestedIcon />}
              onClick={handleClose}
            >
              ยกเลิก
            </Button>
            <Button
              variant="contained"
              //startIcon={<DeleteForeverIcon />}
              color="error"
              onClick={() => handleCancel(localStorage.getItem("token"))}
            >
              ยืนยัน
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}
