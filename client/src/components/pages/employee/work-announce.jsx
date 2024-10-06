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
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
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
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

import { Link, useNavigate } from "react-router-dom";

import dayjs from "dayjs";
import "dayjs/locale/th";

import { workList } from "../../../services/work";
import { loadPhoto } from "../../../services/user";
import { currentUser } from "../../../services/auth";
import { getReviewOwner } from "../../../services/review";
import { createChat } from "../../../services/chat";
import { profileUser } from "../../../services/user";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function WorkAnnounce() {
  const [data, setData] = useState([]);
  const [work, setWork] = useState([]);
  const [selectedTab, setSelectedTab] = useState();
  const [workPositionChecked, setWorkPositionChecked] = useState({
    เสิร์ฟ: false,
    ล้างจาน: false,
    ครัว: false,
    แพ็คสินค้า: false,
    สต๊อกสินค้า: false,
    คัดแยกสินค้า: false,
  });
  const [companyId, setCompanyId] = useState([]);
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [review, setReview] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [employeeId1, setEmployeeId1] = useState("");
  const [nameCompany, setNameCompany] = useState("");
  const [selectedJobTitle, setSelectedJobTitle] = useState("");
  const [timeRange, setTimeRange] = useState({
    startTime: "",
    endTime: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const baseURL = import.meta.env.VITE_API;

  const handleClickOpen = (ownerID) => {
    console.log(ownerID);
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    loadData(token);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (companyId.length > 0) {
      loadDataOwner(token);
    }
  }, [companyId]);

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

        const uniqueCompanyIdArray = Array.from(
          new Set(filteredData.map((item) => item.companyId))
        );

        setCompanyId(uniqueCompanyIdArray);
        setData(filteredData);
        setWork(filteredData);
        setLoading(false);
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

  const handleCheckboxChange = (position) => {
    setWorkPositionChecked((prev) => ({
      ...prev,
      [position]: !prev[position],
    }));
  };

  const onSubmit = async (workDay, tabIndex) => {
    const isAnyCheckboxSelected = Object.values(workPositionChecked).some(
      (checked) => checked
    );

    const filteredData = data.filter((work) => {
      const isWithinTimeRange =
        (!timeRange.startTime ||
          dayjs(work.workStartTime).isAfter(
            dayjs()
              .hour(timeRange.startTime.split(":")[0])
              .minute(timeRange.startTime.split(":")[1])
          )) &&
        (!timeRange.endTime ||
          dayjs(work.workEndTime).isBefore(
            dayjs()
              .hour(timeRange.endTime.split(":")[0])
              .minute(timeRange.endTime.split(":")[1])
          ));

      return (
        work.workDay === workDay &&
        (isAnyCheckboxSelected
          ? workPositionChecked[work.workPosition]
          : true) &&
        (selectedJobTitle ? work.workPosition === selectedJobTitle : true) &&
        isWithinTimeRange &&
        (searchTerm
          ? work.companyName.toLowerCase().includes(searchTerm.toLowerCase())
          : true) // Filter by company name
      );
    });

    setWork(filteredData);
    setSelectedTab(tabIndex);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    loadData(token); // Reload data when search term changes
  }, [searchTerm]);

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

  const currentDate = dayjs();
  // Filter out dates with no data
  const datesWithData = data
    .map((item) => item.workDay)
    .filter((date) =>
      dayjs(date).isAfter(currentDate.subtract(1, "day"), "day")
    );

  const uniqueDates = Array.from(new Set(datesWithData));

  // Sort uniqueDates in ascending order
  uniqueDates.sort((a, b) => (dayjs(a).isBefore(dayjs(b)) ? -1 : 1));

  const averageRating =
    review.length === 0
      ? 0
      : review.reduce((sum, employee) => sum + employee.rating, 0) /
        review.length;

  return (
    <>
      <Box component="form" noValidate>
        <Typography variant="h6" gutterBottom>
          ประกาศจ้างงาน
        </Typography>

        {uniqueDates.length === 0 ? null : (
          <FormGroup>
            <Stack direction="row" spacing={0.5}>
              <TextField
                label="ค้นหาร้านอาหาร"
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FormControl fullWidth>
                <InputLabel>เลือกต่ำแหน่งาน</InputLabel>
                <Select
                  value={selectedJobTitle}
                  onChange={(e) => setSelectedJobTitle(e.target.value)}
                  displayEmpty
                  label="เลือกต่ำแหน่งาน"
                >
                  {Object.keys(workPositionChecked).map((position) => (
                    <MenuItem key={position} value={position}>
                      {position}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Time Range Filter */}
              <Stack direction="row" spacing={1}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    label="เวลาเริ่ม"
                    ampm={false}
                    value={
                      timeRange.startTime
                        ? dayjs(`2023-01-01T${timeRange.startTime}`)
                        : null
                    }
                    onChange={(newValue) => {
                      const timeString = newValue
                        ? newValue.format("HH:mm")
                        : "";
                      setTimeRange({ ...timeRange, startTime: timeString });
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />

                  <TimePicker
                    label="เวลาสิ้นสุด"
                    ampm={false}
                    value={
                      timeRange.endTime
                        ? dayjs(`2023-01-01T${timeRange.endTime}`)
                        : null
                    }
                    onChange={(newValue) => {
                      const timeString = newValue
                        ? newValue.format("HH:mm")
                        : "";
                      setTimeRange({ ...timeRange, endTime: timeString });
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </Stack>
            </Stack>
          </FormGroup>
        )}
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
                          src={`${baseURL}/uploads/company/${
                            image[item.companyId]
                          }`}
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
                                  .format("HH:mm")}
                                น.
                              </Typography>
                            </Stack>
                            <Stack direction={"row"}>
                              <LocalAtmIcon />
                              <Typography variant="body1">
                                {item.dailyWage}บาท/ชั่วโมง
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
