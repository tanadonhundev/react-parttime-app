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
import Chip from "@mui/material/Chip";
import FormGroup from "@mui/material/FormGroup";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import Divider from "@mui/material/Divider";
import Rating from "@mui/material/Rating";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import BadgeIcon from "@mui/icons-material/Badge";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import dayjs from "dayjs";
import "dayjs/locale/th";

import { workList } from "../../../services/work";
import { currentUser } from "../../../services/auth";
import { getReviewOwner } from "../../../services/review";
import { createChat } from "../../../services/chat";
import { profileUser } from "../../../services/user";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const jobPositions = [
  { value: "", label: "ทั้งหมด" },
  { value: "เสิร์ฟ", label: "เสิร์ฟ" },
  { value: "ล้างจาน", label: "ล้างจาน" },
  { value: "ครัว", label: "ครัว" },
  { value: "แพ็คสินค้า", label: "แพ็คสินค้า" },
  { value: "สต๊อกสินค้า", label: "สต๊อกสินค้า" },
  { value: "คัดแยกสินค้า", label: "คัดแยกสินค้า" },
];

export default function WorkAnnounce() {
  const [data, setData] = useState([]);
  const [work, setWork] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [review, setReview] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [employeeId1, setEmployeeId1] = useState("");
  const [nameCompany, setNameCompany] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJobPosition, setSelectedJobPosition] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const navigate = useNavigate();

  const baseURL = import.meta.env.VITE_API;

  const handleClickOpen = (ownerID) => {
    const token = localStorage.getItem("token");
    setOpen(true);
    getReviewOwner(token, ownerID)
      .then((res) => {
        setReview(res.data);
      })
      .catch((error) => console.log(error));
    profileUser(token, ownerID)
      .then((res) => {
        setNameCompany(res.data.companyName);
        //setReview(res.data);
      })
      .catch((error) => console.log(error));
  };

  const handleClose = () => {
    setOpen(false);
    setReview([]);
  };

  const grayCardMediaClass = {
    filter: "grayscale(70%)",
  };

  const disabledChipStyle = {
    opacity: 0.5,
    pointerEvents: "none",
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    loadData(token);
  }, []);

  const loadData = (token) => {
    currentUser(token)
      .then((currentUserResponse) => {
        setEmployeeId(currentUserResponse.data._id);
        setEmployeeId1(currentUserResponse.data._id);
        if (currentUserResponse.data.statusBlacklist === true) {
          setLoading(false);
        }
        return workList(token);
      })
      .then((workListResponse) => {
        const filteredData = workListResponse.data.filter((item) =>
          dayjs(item.workDay).isAfter(dayjs().subtract(1, "day"))
        );
        setData(filteredData);
        setWork(filteredData);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };
  const crateChat = async (companyId, nameCompany) => {
    const data = {
      firstId: employeeId,
      secondId: companyId,
    };
    createChat(data)
      .then(() => {
        const queryParams = new URLSearchParams({
          employeeId: employeeId,
          companyId: companyId,
          nameCompany: nameCompany,
        }).toString();
        navigate(`/dashboard-employee/chat?${queryParams}`);
      })
      .catch((error) => console.log(error));
  };

  const crateChat1 = async (
    employeeId,
    employeeFirstName,
    employeeLastName
  ) => {
    const data = {
      firstId: employeeId1,
      secondId: employeeId,
    };
    createChat(data)
      .then(() => {
        const queryParams = new URLSearchParams({
          companyId: employeeId1,
          employeeId: employeeId,
          employeeFirstName: employeeFirstName,
          employeeLastName: employeeLastName,
        }).toString();
        navigate(`/dashboard-employee/chat?${queryParams}`);
      })
      .catch((error) => console.log(error));
  };

  const handleSearch = (data) => {
    setSearchTerm(data.searchTerm);
    setSelectedJobPosition(data.jobPosition); // Store the selected job position
    setStartTime(data.startTime);
    setEndTime(data.endTime);
  };

  const onSubmit = (date, index) => {
    setSelectedTab(index); // Set the selected tab

    // Filter the data based on the provided date
    const filteredByDate = data.filter((item) =>
      dayjs(item.workDay).isSame(dayjs(date.workDay), "day")
    );

    // Update the filtered work based on the filteredByDate
    setWork(filteredByDate);
  };

  const filteredWork = data.filter((item) => {
    const matchesSearchTerm = item.companyName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesJobPosition = selectedJobPosition
      ? item.workPosition === selectedJobPosition
      : true;

    // Convert workStartTime and workEndTime to Date objects
    const workStartTime = new Date(item.workStartTime);
    const workEndTime = new Date(item.workEndTime);

    // Get only the time portion in milliseconds
    const workStartHours =
      workStartTime.getHours() * 3600000 +
      workStartTime.getMinutes() * 60000 +
      workStartTime.getSeconds() * 1000;
    const workEndHours =
      workEndTime.getHours() * 3600000 +
      workEndTime.getMinutes() * 60000 +
      workEndTime.getSeconds() * 1000;
    // Get only the time portion for startTime and endTime
    const startTimeHours = startTime
      ? new Date(startTime).getHours() * 3600000 +
        new Date(startTime).getMinutes() * 60000 +
        new Date(startTime).getSeconds() * 1000
      : null;
    const endTimeHours = endTime
      ? new Date(endTime).getHours() * 3600000 +
        new Date(endTime).getMinutes() * 60000 +
        new Date(endTime).getSeconds() * 1000
      : null;

    const matchesStartTime = startTimeHours
      ? workStartHours >= startTimeHours
      : true;
    const matchesEndTime = endTimeHours ? workEndHours <= endTimeHours : true;

    return (
      matchesSearchTerm &&
      matchesJobPosition &&
      matchesStartTime &&
      matchesEndTime
    );
  });

  const uniqueDates = Array.from(new Set(filteredWork));

  const averageRating =
    review.length === 0
      ? 0
      : review.reduce((sum, employee) => sum + employee.rating, 0) /
        review.length;

  return (
    <>
      <Typography variant="h6" gutterBottom>
        ประกาศจ้างงาน
      </Typography>
      <form onSubmit={handleSubmit(handleSearch)}>
        <FormGroup sx={{ padding: 2 }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="ค้นหาชื่อร้านอาหาร/คลังสินค้า"
              variant="outlined"
              {...register("searchTerm")}
              fullWidth
              error={!!errors.searchTerm}
              helperText={
                errors.searchTerm ? "กรุณากรอกชื่อร้านอาหารหรือคลังสินค้า" : ""
              }
            />
            <FormControl fullWidth>
              <InputLabel id="job-position-label">เลือกตำแหน่งงาน</InputLabel>
              <Select
                labelId="job-position-label"
                {...register("jobPosition")}
                defaultValue=""
                label="เลือกตำแหน่งงาน"
                error={!!errors.jobPosition}
              >
                {jobPositions.map((position) => (
                  <MenuItem key={position.value} value={position.value}>
                    {position.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
          <Grid container spacing={2} mt={2}>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                  {...register("startTime")}
                  onChange={(newValue) => {
                    setValue("startTime", newValue);
                  }}
                  label="เวลาเริ่มงาน"
                  ampm={false}
                  fullWidth
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                  {...register("endTime")}
                  onChange={(newValue) => {
                    setValue("endTime", newValue);
                  }}
                  label="เวลาเลิกงาน"
                  ampm={false}
                  fullWidth
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
          >
            ค้นหา
          </Button>
        </FormGroup>
      </form>

      <Tabs
        value={selectedTab}
        variant="scrollable"
        scrollButtons="auto"
        onChange={(event, newValue) =>
          onSubmit(uniqueDates[newValue], newValue)
        }
      >
        {uniqueDates.map((date, index) => (
          <Tab
            key={index}
            label={dayjs(date.workDay).locale("th").format("ddd DD MMM")}
          />
        ))}
      </Tabs>
      <Stack spacing={{ xl: 1, sm: 2, md: 4 }} justifyContent="center">
        {loading ? (
          <Stack alignItems={"center"}>
            <CircularProgress />
            <Typography>กำลังโหลดข้อมูลข้อมูล</Typography>
          </Stack>
        ) : (
          <>
            {uniqueDates.length === 0 ? (
              <Typography variant="h6" align="center">
                ยังไม่มีประกาศจ้างงาน
              </Typography>
            ) : (
              <Grid container spacing={1}>
                {work.map((item) => (
                  <Grid key={item._id} item lg={3} md={6} sm={12}>
                    <Card>
                      <CardActionArea>
                        <CardMedia
                          component="img"
                          height="140"
                          src={`${baseURL}/uploads/company/${item.companyPhoto}`}
                          alt="Company Image"
                          sx={
                            item.numOfReady === item.numOfEmployee
                              ? grayCardMediaClass
                              : {}
                          }
                        />
                        {item.numOfReady === item.numOfEmployee && (
                          <div
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              backgroundColor: "rgba(0, 0, 0, 0.2)",
                            }}
                          >
                            <Typography variant="h5" color="red">
                              ตำแหน่งเต็ม
                            </Typography>
                          </div>
                        )}
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
                              <Chip
                                icon={<BadgeIcon />}
                                label={item.workPosition}
                                color="info"
                                variant="outlined"
                                sx={
                                  item.numOfReady === item.numOfEmployee
                                    ? disabledChipStyle
                                    : {}
                                }
                              />
                            </Stack>
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
                            <Stack
                              direction={"row"}
                              justifyContent={"flex-end"}
                            >
                              <Button
                                variant="contained"
                                color="warning"
                                disabled={
                                  item.numOfReady === item.numOfEmployee
                                }
                                onClick={() =>
                                  crateChat(item.companyId, item.companyName)
                                }
                              >
                                แชท
                              </Button>
                            </Stack>
                            <Stack
                              direction={"row"}
                              spacing={1}
                              justifyContent={"flex-end"}
                              onClick={() => handleClickOpen(item.companyId)}
                            >
                              <Button
                                variant="contained"
                                disabled={
                                  item.numOfReady === item.numOfEmployee
                                }
                              >
                                ดูรีวิว
                              </Button>
                              <Button
                                component={Link}
                                to={`/dashboard-employee/work-descrip/${item._id}`}
                                variant="contained"
                                color="success"
                                startIcon={<HowToRegIcon />}
                                disabled={
                                  item.numOfReady === item.numOfEmployee
                                }
                              >
                                สมัครงาน
                              </Button>
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
      <Dialog
        open={open}
        TransitionComponent={Transition}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{ style: { width: "1000px" } }}
      >
        <DialogTitle>
          {"ข้อมูลการรีวิว"} {nameCompany}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {review.length === 0 ? (
              <Stack direction={"row"} justifyContent={"center"}>
                <Typography variant="body1">ยังไม่มีข้อมูลการรีวิว</Typography>
              </Stack>
            ) : (
              <>
                {/* แสดงคะแนนรีวิวเฉลี่ย */}
                <Stack direction={"row"} justifyContent={"center"}>
                  <Typography variant="subtitle1" gutterBottom>
                    คะแนนรีวิวเฉลี่ย:{" "}
                    <Rating
                      name="average-rating"
                      value={averageRating}
                      readOnly
                    />
                    <span style={{ marginLeft: 8 }}>
                      {averageRating.toFixed(1)}
                    </span>
                  </Typography>
                </Stack>
                <Divider />
                {review.map((employee, index) => (
                  <div key={index}>
                    <Stack direction={"row"} spacing={1}>
                      <Stack direction={"row"} spacing={2}>
                        <Typography>
                          {employee.employeeFirstName}{" "}
                          {employee.employeeLastName}
                        </Typography>
                      </Stack>
                      <Typography>
                        |{" "}
                        {dayjs(employee.createdAt).format(
                          "DD-MM-YYYY HH:mm:ss"
                        )}
                      </Typography>
                    </Stack>
                    <Typography variant="subtitle1">
                      วันที่ทำงาน:
                      {dayjs(employee.workDay)
                        .locale("th")
                        .format("DD-MM-YYYY")}
                    </Typography>
                    <Stack direction={"row"}>
                      <Typography>คะแนน:</Typography>
                      <Rating
                        name="half-rating-read"
                        defaultValue={employee.rating}
                        readOnly
                      />
                    </Stack>
                    <Typography>ข้อความ: {employee.reviewText}</Typography>
                    {employeeId !== employee.employeeId && (
                      <Stack direction={"row"} justifyContent={"flex-end"}>
                        <Button
                          variant="contained"
                          color="warning"
                          onClick={() =>
                            crateChat1(
                              employee.employeeId,
                              employee.employeeFirstName,
                              employee.employeeLastName
                            )
                          }
                        >
                          แชท
                        </Button>
                      </Stack>
                    )}
                    <br />
                    <Divider />
                    <br />
                  </div>
                ))}
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="error"
            startIcon={<NotInterestedIcon />}
            onClick={handleClose}
          >
            ปิด
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
