import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import Rating from "@mui/material/Rating";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import StarIcon from "@mui/icons-material/Star";

import toast from "react-hot-toast";

import dayjs from "dayjs";
import "dayjs/locale/th";

import { workDescripList } from "../../../services/work";
import { currentUser } from "../../../services/auth";
import { reviewEmployee } from "../../../services/review.js";
import { report } from "../../../services/report";

import { useNavigate } from "react-router-dom";

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

export default function ReviewEmployee() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);
  const [open, setOpen] = useState(false);
  const [openReport, setOpenReport] = useState(false);
  const [employeeToReview, setEmployeeToReview] = useState([]);
  const [employeeToReport, setEmployeeToReport] = useState([]);
  const [value, setValue] = React.useState(5);
  const [hover, setHover] = React.useState(-1);
  const [reviewText, setReviewText] = useState("");
  const [reportText, setReportText] = useState("");

  const baseURL = import.meta.env.VITE_API;

  useEffect(() => {
    const token = localStorage.getItem("token");
    currentUser(token)
      .then((res) => {
        const id = res.data._id;
        loadData(token, id);
      })
      .catch((error) => console.log(error));
  }, []);

  const loadData = async (token, id) => {
    workDescripList(token, id)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
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

  const handleClickOpen = (employee, companyId, companyName, workDay) => {
    setEmployeeToReview({ ...employee, companyId, companyName, workDay });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEmployeeToReview(null);
  };

  const handleClickOpenReport = (
    user,
    employeeFirstName,
    employeeLastName,
    employeeId
  ) => {
    setEmployeeToReport({
      ...user,
      employeeFirstName,
      employeeLastName,
      employeeId,
    });
    setOpenReport(true);
  };

  const handleCloseReport = () => {
    setOpenReport(false);
    setEmployeeToReport(null);
    setReportText("");
  };

  const handleReviewEmployee = async (token) => {
    if (employeeToReview) {
      const values = {
        companyId: employeeToReview.companyId,
        companyName: employeeToReview.companyName,
        workDay: employeeToReview.workDay,
        employeeId: employeeToReview.employeeId,
        status: employeeToReview.employmentStatusRe,
        employeeRating: value,
        employeeReviewText: reviewText,
      };
      reviewEmployee(token, values)
        .then((res) => {
          toast.success(res.data);
          handleClose();
          loadData(token, employeeToReview.companyId);
        })
        .catch((error) => console.log(error));
    }
  };

  const handleReportEmployee = async (token) => {
    if (employeeToReport) {
      const values = {
        reporter: employeeToReport.companyId,
        workDay: employeeToReport.workDay,
        reportText: reportText,
        peopleReporter: employeeToReport.employeeId,
        companyId: employeeToReport.companyId,
        employeeId: employeeToReport.employeeId,
      };
      report(token, values)
        .then((res) => {
          toast.success(res.data);
          handleCloseReport();
          loadData(token, employeeToReport.companyId);
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        รีวิวพนักงาน
      </Typography>
      {loading ? (
        <Stack alignItems={"center"}>
          <CircularProgress />
          <Typography>กำลังโหลดข้อมูลข้อมูล</Typography>
        </Stack>
      ) : data.length === 0 ? (
        <Typography variant="h6" align="center">
          ยังไม่มีพนักงานให้รีวิว
        </Typography>
      ) : uniqueDates.length === 0 ? (
        <Typography variant="h6" align="center">
          ยังไม่มีพนักงานให้รีวิว
        </Typography>
      ) : (
        <>
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
          {uniqueDates.map((date, index) => (
            <div key={index}>
              {index === selectedTab && (
                <div>
                  {datesWithData
                    .filter((item) => item.workDay === date)
                    .map((item, itemIndex) => (
                      <div key={itemIndex}>
                        <br />
                        {item.employees.length > 0 ? (
                          <TableContainer component={Paper}>
                            <Table>
                              <TableHead
                                style={{ backgroundColor: "lightblue" }}
                              >
                                <TableRow>
                                  <TableCell>รูปโปรไฟล์</TableCell>
                                  <TableCell>ชื่อ</TableCell>
                                  <TableCell>นามสกุล</TableCell>
                                  <TableCell>สถานะ</TableCell>
                                  <TableCell>สถานะรีวิว</TableCell>
                                  <TableCell style={{ textAlign: "center" }}>
                                    จัดการ
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {item.employees.map(
                                  (employee, employeeIndex) => (
                                    <TableRow key={employeeIndex}>
                                      <TableCell>
                                        <Avatar
                                          sx={{ width: 35, height: 35 }}
                                          alt="Remy Sharp"
                                          src={
                                            `${baseURL}/uploads/avatar/` +
                                            employee.employeeAvatar
                                          }
                                        />
                                      </TableCell>
                                      <TableCell>
                                        {employee.employeeFirstName}
                                      </TableCell>
                                      <TableCell>
                                        {employee.employeeLastName}
                                      </TableCell>
                                      <TableCell>
                                        {employee.employmentStatus}
                                      </TableCell>
                                      <TableCell>
                                        {employee.employmentStatusRe}
                                      </TableCell>
                                      <TableCell
                                        style={{ textAlign: "center" }}
                                      >
                                        <Stack
                                          direction={"row"}
                                          spacing={1}
                                          justifyContent={"center"}
                                        >
                                          {employee.employmentStatus ===
                                          "พร้อมเริ่มงาน" ? (
                                            <>
                                              <Button
                                                variant="contained"
                                                color="info"
                                                onClick={() =>
                                                  handleClickOpen(
                                                    employee,
                                                    item.companyId,
                                                    item.companyName,
                                                    item.workDay
                                                  )
                                                }
                                                disabled={
                                                  employee.employmentStatusRe ===
                                                  "รีวิวแล้ว"
                                                }
                                              >
                                                รีวิว
                                              </Button>
                                              <Button
                                                variant="contained"
                                                color="error"
                                                onClick={() =>
                                                  handleClickOpenReport(
                                                    item,
                                                    employee.employeeFirstName,
                                                    employee.employeeLastName,
                                                    employee.employeeId
                                                  )
                                                }
                                                disabled={
                                                  employee.employmentStatusRe ===
                                                  "รีวิวแล้ว"
                                                }
                                              >
                                                รายงาน
                                              </Button>
                                            </>
                                          ) : (
                                            <>-</>
                                          )}
                                        </Stack>
                                      </TableCell>
                                    </TableRow>
                                  )
                                )}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        ) : (
                          <TableContainer component={Paper}>
                            <Table>
                              <TableHead
                                style={{ backgroundColor: "lightslategray" }}
                              >
                                <TableRow>
                                  <TableCell style={{ textAlign: "center" }}>
                                    <Typography>
                                      ไม่มีพนักงานให้รีวิว
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                            </Table>
                          </TableContainer>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          ))}
        </>
      )}
      <div>
        <Dialog
          open={open}
          TransitionComponent={Transition}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          PaperProps={{ style: { width: "1000px" } }}
        >
          <DialogTitle>{"รีวิวพนักงาน"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {employeeToReview && employeeToReview.employeeFirstName && (
                <Stack>
                  <span>
                    วันที่:
                    {dayjs(employeeToReview.workDay)
                      .locale("th")
                      .format("ddd DD MMM")}
                  </span>
                  <Stack direction={"row"} spacing={2}>
                    <span>ชื่อ: {employeeToReview.employeeFirstName}</span>
                    <span>นามสกุล: {employeeToReview.employeeLastName}</span>
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
              onClick={() =>
                handleReviewEmployee(localStorage.getItem("token"))
              }
            >
              ยืนยัน
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openReport}
          TransitionComponent={Transition}
          onClose={handleCloseReport}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          PaperProps={{ style: { width: "1000px" } }}
        >
          <DialogTitle>{"รายงานนายจ้าง"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {employeeToReport &&
                employeeToReport.employees &&
                employeeToReport.employees.length > 0 && (
                  <Stack>
                    <span>
                      วันที่:
                      {dayjs(employeeToReport.workDay)
                        .locale("th")
                        .format("ddd DD MMM")}
                    </span>
                    <Stack direction={"row"} spacing={2}>
                      <span>ชื่อ: {employeeToReport.employeeFirstName}</span>
                      <span>นามสกุล: {employeeToReport.employeeLastName}</span>
                      <span>นามสกุล: {employeeToReport._Id}</span>
                    </Stack>
                  </Stack>
                )}
              <br />
              <Stack>
                <TextField
                  label="รายละเอียด"
                  fullWidth
                  multiline
                  rows={4}
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                />
              </Stack>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              color="warning"
              //startIcon={<NotInterestedIcon />}
              onClick={handleCloseReport}
            >
              ยกเลิก
            </Button>
            <Button
              variant="contained"
              //startIcon={<DeleteForeverIcon />}
              color="error"
              onClick={() =>
                handleReportEmployee(localStorage.getItem("token"))
              }
            >
              ยืนยัน
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}
