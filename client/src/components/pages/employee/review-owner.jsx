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
import Rating from "@mui/material/Rating";
import TextField from "@mui/material/TextField";

import BadgeIcon from "@mui/icons-material/Badge";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import StarIcon from "@mui/icons-material/Star";
import NotInterestedIcon from "@mui/icons-material/NotInterested";

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
import { reviewOwner } from "../../../services/review";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const labels = {
  1: "1",
  2: "2",
  3: "3",
  4: "4",
  5: "5",
};

function getLabelText(value) {
  return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
}

export default function ReviewOwner() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);
  const [companyId, setCompanyId] = useState([]);
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState("");
  const [ownerToReview, setOwnerToReview] = useState([]);
  const [employeeId, setEmployeeId] = useState();
  const [value, setValue] = React.useState(5);
  const [hover, setHover] = React.useState(-1);
  const [reviewText, setReviewText] = useState("");

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
    const token = localStorage.getItem("token");
    if (companyId.length > 0) {
      loadDataOwner(token);
    }
  }, [companyId]);

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

  const currentDate = dayjs();
  // Filter out dates with no data
  const datesWithData = data.filter(
    (item) =>
      dayjs(item.workDay).isAfter(currentDate.subtract(5, "day"), "day") &&
      dayjs(item.workDay).isBefore(currentDate.subtract(0, "day"), "day")
  );
  // Extract unique dates from the filtered data
  const uniqueDates = Array.from(
    new Set(datesWithData.map((item) => item.workDay))
  );

  uniqueDates.sort((a, b) => (dayjs(a).isBefore(dayjs(b)) ? -1 : 1));

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleClickOpen = (user, employeeFirstName, employeeLastName) => {
    setOwnerToReview({ ...user, employeeFirstName, employeeLastName });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setOwnerToReview(null);
  };

  const handleReviewOwner = async (token) => {
    if (ownerToReview) {
      const values = {
        companyId: ownerToReview.companyId,
        employeeFirstName: ownerToReview.employeeFirstName,
        employeeLastName: ownerToReview.employeeLastName,
        workDay: ownerToReview.workDay,
        employeeId: employeeId,
        employeeRating: value,
        employeeReviewText: reviewText,
      };
      reviewOwner(token, values)
        .then((res) => {
          toast.success(res.data);
          handleClose();
          loadData(token, ownerToReview.employees[0].employeeId);
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <>
      <Box component="form" noValidate>
        <Typography variant="h6" gutterBottom>
          รีวิวนายจ้าง
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
            {datesWithData.length === 0 ? (
              <Typography variant="h6" align="center">
                ยังไม่มีงานให้รีวิว
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {datesWithData
                  .filter((item) =>
                    dayjs(item.workDay).isSame(uniqueDates[selectedTab], "day")
                  )
                  .map((item) => (
                    <Grid key={item._id} item lg={3} sm={6} xs={12}>
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
                                <Chip
                                  icon={<BadgeIcon />}
                                  label={item.workPosition}
                                  color="info"
                                  variant="outlined"
                                />
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
                              </Stack>
                              <Stack
                                direction={"row"}
                                justifyContent={"flex-end"}
                                spacing={1}
                              >
                                {item.employees.map((employee) => {
                                  if (employee.employeeId === employeeId) {
                                    return (
                                      <React.Fragment key={employee.employeeId}>
                                        {employee.employmentStatus ===
                                        "พร้อมเริ่มงาน" ? (
                                          <>
                                            <Button
                                              variant="contained"
                                              color="info"
                                              onClick={() =>
                                                handleClickOpen(
                                                  item,
                                                  employee.employeeFirstName,
                                                  employee.employeeLastName
                                                )
                                              }
                                              disabled={
                                                employee.ownermentStatusRe ===
                                                "รีวิวแล้ว"
                                              }
                                            >
                                              รีวิว
                                            </Button>
                                            <Button
                                              variant="contained"
                                              color="error"
                                              disabled={
                                                employee.ownermentStatusRe ===
                                                "รีวิวแล้ว"
                                              }
                                            >
                                              รายงาน
                                            </Button>
                                          </>
                                        ) : (
                                          <>
                                            <Button
                                              variant="outlined"
                                              color="error"
                                            >
                                              {employee.employmentStatus}
                                            </Button>
                                          </>
                                        )}
                                        <Stack
                                          direction={"row"}
                                          spacing={1}
                                          justifyContent={"center"}
                                        ></Stack>
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
          <DialogTitle>{"รีวิวนายจ้าง"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {ownerToReview &&
                ownerToReview.employees &&
                ownerToReview.employees.length > 0 && (
                  <Stack>
                    <span>
                      วันที่:
                      {dayjs(ownerToReview.workDay)
                        .locale("th")
                        .format("ddd DD MMM")}
                    </span>
                    <Stack direction={"row"} spacing={2}>
                      <span>ชื่อ: {ownerToReview.companyName}</span>
                    </Stack>
                    <br />
                    <Box
                      sx={{
                        width: 200,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      คะแนน
                      <Rating
                        name="hover-feedback"
                        value={value}
                        precision={1}
                        getLabelText={getLabelText}
                        onChange={(event, newValue) => {
                          setValue(newValue);
                        }}
                        onChangeActive={(event, newHover) => {
                          setHover(newHover);
                        }}
                        emptyIcon={
                          <StarIcon
                            style={{ opacity: 0.55 }}
                            fontSize="inherit"
                          />
                        }
                      />
                      {value !== null && (
                        <Box sx={{ ml: 2 }}>
                          {labels[hover !== -1 ? hover : value]}
                        </Box>
                      )}
                    </Box>
                    <br />
                    <Grid item xs={12} sm={12}>
                      <TextField
                        label="ข้อความรีวิว"
                        fullWidth
                        multiline
                        rows={4}
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                      />
                    </Grid>
                  </Stack>
                )}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              color="warning"
              //startIcon={<NotInterestedIcon />}
              onClick={handleClose}
            >
              ยกเลิก
            </Button>
            <Button
              variant="contained"
              //startIcon={<DeleteForeverIcon />}
              color="error"
              onClick={() => handleReviewOwner(localStorage.getItem("token"))}
            >
              ยืนยัน
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}
