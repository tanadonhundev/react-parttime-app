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
import Divider from "@mui/material/Divider";

import NotInterestedIcon from "@mui/icons-material/NotInterested";

import dayjs from "dayjs";
import "dayjs/locale/th";

import { workDescripList } from "../../../services/work";
import { currentUser } from "../../../services/auth";
import { ChangeEmploymentStatus } from "../../../services/work";
import { profileUser } from "../../../services/user";
import { getReviewEmployee } from "../../../services/review";

import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function ManageEmployee() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);
  const [open, setOpen] = useState(false);
  const [dataEmployee, setDataEmployee] = useState([]);
  const [reviewEmployee, setReviewEmployee] = useState([]);
  const [countdown, setCountdown] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const baseURL = import.meta.env.VITE_API;

  const navigate = useNavigate();

  const handleClickOpen = (employeeID) => {
    const token = localStorage.getItem("token");
    setOpen(true);
    profileUser(token, employeeID)
      .then((res) => {
        setDataEmployee(res.data);
      })
      .catch((error) => console.log(error));

    getReviewEmployee(token, employeeID)
      .then((res) => {
        setReviewEmployee(res.data);
        console.log(res.data);
      })
      .catch((error) => console.log(error));
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    currentUser(token)
      .then((res) => {
        const id = res.data._id;
        loadData(token, id);
      })
      .catch((error) => console.log(error));
  }, []);

  const updateCountdown = () => {
    const currentDate = dayjs();
    const targetDate = dayjs(uniqueDates[selectedTab]);
    const diffInSeconds = targetDate.diff(currentDate, "second");

    const hours = Math.floor(diffInSeconds / 3600);
    const minutes = Math.floor((diffInSeconds % 3600) / 60);
    const seconds = diffInSeconds % 60;

    setCountdown({
      hours: hours >= 0 ? hours : 0,
      minutes: minutes >= 0 ? minutes : 0,
      seconds: seconds >= 0 ? seconds : 0,
    });
  };

  // Update countdown every second
  useEffect(() => {
    const intervalId = setInterval(updateCountdown, 1000);

    return () => clearInterval(intervalId);
  }, [selectedTab]);

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

  const handleConfirm = (item, employeeId, companyId, workDay, action) => {
    const token = localStorage.getItem("token");
    const values = {
      workDay: workDay,
      companyId: companyId,
      employeeId: employeeId,
      status: item,
      action: action,
    };
    console.log(values);
    ChangeEmploymentStatus(token, values)
      .then((res) => {
        loadData(token, companyId);
        toast.success(res.data);
      })
      .catch((error) => console.log(error));
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

  return (
    <>
      <Typography variant="h6" gutterBottom>
        จัดการพนักงาน
      </Typography>
      {loading ? (
        <Stack alignItems={"center"}>
          <CircularProgress />
          <Typography>กำลังโหลดข้อมูลข้อมูล</Typography>
        </Stack>
      ) : data.length === 0 ? (
        <Typography variant="h6" align="center">
          ยังไม่มีประกาศจ้างงาน
        </Typography>
      ) : uniqueDates.length === 0 ? (
        <Typography variant="h5">ไม่มีข้อมูล</Typography>
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
                        <Stack direction={"row"} spacing={2}>
                          <Typography variant="h6">
                            รายละเอียดจ้างงาน
                          </Typography>
                          <Typography variant="h6">
                            {dayjs(date).locale("th").format("ddd DD MMM")}
                          </Typography>
                          <Typography variant="h6">
                            {dayjs(item.workStartTime)
                              .locale("th")
                              .format("HH:mm")}
                            -
                            {dayjs(item.workEndTime)
                              .locale("th")
                              .format("HH:mm")}
                          </Typography>
                        </Stack>
                        <TableContainer component={Paper}>
                          <Table aria-label="simple table">
                            <TableHead style={{ backgroundColor: "lightblue" }}>
                              <TableRow>
                                <TableCell>ตำแหน่ง</TableCell>
                                <TableCell style={{ textAlign: "center" }}>
                                  เปิดรับ
                                </TableCell>
                                <TableCell style={{ textAlign: "center" }}>
                                  มาสมัคร
                                </TableCell>
                                <TableCell style={{ textAlign: "center" }}>
                                  พร้อมเริ่มงาน
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow key={itemIndex}>
                                <TableCell>{item.workPosition}</TableCell>
                                <TableCell style={{ textAlign: "center" }}>
                                  {item.numOfEmployee}
                                </TableCell>
                                <TableCell style={{ textAlign: "center" }}>
                                  {item.employees.length}
                                </TableCell>
                                <TableCell style={{ textAlign: "center" }}>
                                  {item.numOfReady}
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                        <br />
                        คัดเลือกคนเข้าทำงาน {countdown.hours}h{" "}
                        {countdown.minutes}m {countdown.seconds}s
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
                                      <TableCell
                                        style={{
                                          color:
                                            employee.employmentStatus ===
                                            "พร้อมเริ่มงาน"
                                              ? "green"
                                              : employee.employmentStatus ===
                                                "ตำแหน่งเต็ม"
                                              ? "red"
                                              : employee.employmentStatus ===
                                                "รอยืนยัน"
                                              ? "orange"
                                              : "inherit",
                                        }}
                                      >
                                        {employee.employmentStatus}
                                      </TableCell>
                                      <TableCell
                                        style={{ textAlign: "center" }}
                                      >
                                        <Stack
                                          direction={"row"}
                                          spacing={1}
                                          justifyContent={"center"}
                                        >
                                          <Button
                                            variant="contained"
                                            onClick={() =>
                                              handleConfirm(
                                                employee.employmentStatus,
                                                employee.employeeId,
                                                item.companyId,
                                                item.workDay
                                              )
                                            }
                                            disabled={
                                              employee.employmentStatus ===
                                                "รอยืนยัน" ||
                                              employee.employmentStatus ===
                                                "พร้อมเริ่มงาน"
                                            }
                                          >
                                            ยืนยัน
                                          </Button>
                                          <Button
                                            variant="contained"
                                            color="error"
                                            onClick={() =>
                                              handleConfirm(
                                                employee.employmentStatus,
                                                employee.employeeId,
                                                item.companyId,
                                                item.workDay,
                                                1
                                              )
                                            }
                                            disabled={
                                              employee.employmentStatus ===
                                                "ตำแหน่งเต็ม" ||
                                              employee.employmentStatus ===
                                                "พร้อมเริ่มงาน"
                                            }
                                          >
                                            ปฎิเสธ
                                          </Button>
                                          <Button
                                            variant="contained"
                                            color="success"
                                            onClick={() =>
                                              handleClickOpen(
                                                employee.employeeId
                                              )
                                            }
                                          >
                                            ดูข้อมูล
                                          </Button>
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
                                      ยังไม่มีคนมาสมัครงาน
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
      <Dialog
        open={open}
        TransitionComponent={Transition}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{ style: { width: "1000px" } }}
      >
        <DialogTitle>{"ข้อมูลพนักงาน"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dataEmployee && (
              <div>
                <Stack direction="row" justifyContent="flex-end">
                  {dataEmployee.statusVerify === "รอตรวจสอบ" && (
                    <Button variant="outlined" color="error">
                      {dataEmployee.statusVerify}
                    </Button>
                  )}
                  {dataEmployee.statusVerify === "ตรวจสอบแล้ว" && (
                    <Button variant="outlined" color="success">
                      {dataEmployee.statusVerify}
                    </Button>
                  )}
                  {dataEmployee.statusVerify === "รอแก้ไขข้อมูล" && (
                    <Button variant="outlined" color="warning">
                      {dataEmployee.statusVerify}
                    </Button>
                  )}
                </Stack>
                <Stack direction={"row"} justifyContent={"center"}>
                  <Avatar
                    sx={{ width: 100, height: 100 }}
                    alt="Remy Sharp"
                    src={
                      `${baseURL}/uploads/avatar/` + dataEmployee.avatarphoto
                    }
                  />
                </Stack>
                <Stack
                  direction={"row"}
                  justifyContent={"space-around"}
                  spacing={2}
                >
                  <Typography>ชื่อ:{dataEmployee.firstName}</Typography>
                  <Typography>นามสกุล:{dataEmployee.lastName}</Typography>
                  <Typography>อายุ:{dataEmployee.age} ปี</Typography>
                </Stack>
                <br />
                <Divider />
                <br />
                <Stack direction={"row"} justifyContent={"center"}>
                  <Typography>ที่อยู่ตามบัตรประชาชน</Typography>
                </Stack>
                <Stack
                  direction={"row"}
                  justifyContent={"space-around"}
                  spacing={2}
                >
                  <Typography>บ้านเลขที่:{dataEmployee.houseNumber}</Typography>
                  <Typography>หมู่ที่:{dataEmployee.groupNumber}</Typography>
                  <Typography>ตำบล:{dataEmployee.subDistrict}</Typography>
                </Stack>
                <Stack
                  direction={"row"}
                  justifyContent={"space-around"}
                  spacing={2}
                >
                  <Typography>อำเภอ:{dataEmployee.district}</Typography>
                  <Typography>จังหวัด:{dataEmployee.proVince}</Typography>
                  <Typography>รหัสไปรษณีย์:{dataEmployee.postCode}</Typography>
                </Stack>
                <br />
                <Divider />
                <br />
                {reviewEmployee.map((employee, index) => (
                  <div key={index}>
                    <Typography>
                      วันที่รีิวิว:
                      {dayjs(employee.createdAt).format("ddd DD MMM HH:mm:ss")}
                    </Typography>
                    <Stack direction={"row"} spacing={2}>
                      <Typography>
                        สถานที่ทำงาน:
                        {employee.companyName}
                      </Typography>
                      <Typography>
                        วันที่ทำงาน:
                        {dayjs(employee.workDay).format("ddd DD MMM")}
                      </Typography>
                      <Typography>
                        คะแนน:
                        {employee.rating}
                      </Typography>
                    </Stack>
                    <Stack direction={"row"}>
                      <Typography>
                        ข้อความรีวิว: {employee.reviewText}
                      </Typography>
                    </Stack>
                    <br />
                    <Divider />
                    <br />
                  </div>
                ))}
              </div>
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
