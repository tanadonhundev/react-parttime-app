import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import { useNavigate, Link } from "react-router-dom";

import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import NotInterestedIcon from "@mui/icons-material/NotInterested";

import toast from "react-hot-toast";

import {
  userList,
  removeUser,
  statusBlacklisUser,
} from "../../../services/user";
import { currentUser } from "../../../services/auth";
import { createChat } from "../../../services/chat";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function ManageUser() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isCheckedChecked, setIsCheckedChecked] = useState(false);
  const [isCheckedPending, setIsCheckedPending] = useState(false);
  const [isCheckedEditing, setIsCheckedEditing] = useState(false);
  const [adminId, setAdminId] = useState("");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const baseURL = import.meta.env.VITE_API;

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    loadData(token);
    currentUser(token)
      .then((res) => {
        const id = res.data._id;
        setAdminId(id);
      })
      .catch((error) => console.log(error));
  }, []);

  const loadData = async (token) => {
    userList(token)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };

  const handleRemoveUser = async (token) => {
    if (userToDelete) {
      removeUser(token, userToDelete._id)
        .then((res) => {
          toast.success(res.data);
          handleClose();
          loadData(token);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;

    if (checked) {
      // ถ้ามี Checkbox อื่นถูกเลือกอยู่แล้วให้ยกเลิกการเลือก Checkbox นี้
      if (
        name === "isCheckedChecked" &&
        (isCheckedPending || isCheckedEditing)
      ) {
        setIsCheckedPending(false);
        setIsCheckedEditing(false);
      } else if (
        name === "isCheckedPending" &&
        (isCheckedChecked || isCheckedEditing)
      ) {
        setIsCheckedChecked(false);
        setIsCheckedEditing(false);
      } else if (
        name === "isCheckedEditing" &&
        (isCheckedChecked || isCheckedPending)
      ) {
        setIsCheckedChecked(false);
        setIsCheckedPending(false);
      }
    }

    // ตั้งค่าสถานะของ Checkbox ที่ถูกเลือก
    switch (name) {
      case "isCheckedChecked":
        setIsCheckedChecked(checked);
        break;
      case "isCheckedPending":
        setIsCheckedPending(checked);
        break;
      case "isCheckedEditing":
        setIsCheckedEditing(checked);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (!isCheckedChecked && !isCheckedPending && !isCheckedEditing) {
      loadData(localStorage.getItem("token"));
      return;
    }

    // ทำการ filter ข้อมูลโดยใช้เงื่อนไขของ Checkbox ที่ถูกเลือก
    const filteredData = data.filter((item) => {
      if (isCheckedChecked && item.statusVerify !== "ตรวจสอบแล้ว") return false;
      if (isCheckedPending && item.statusVerify !== "รอตรวจสอบ") return false;
      if (isCheckedEditing && item.statusVerify !== "รอแก้ไขข้อมูล")
        return false;
      return true;
    });
    setData(filteredData);
  }, [isCheckedChecked, isCheckedPending, isCheckedEditing]);

  const handleOnChangeStatus = async (token, e, id) => {
    const value = {
      id: id,
      statusBlacklist: e.target.checked,
    };
    statusBlacklisUser(token, value)
      .then((res) => {
        toast.success(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleClickOpen = (user) => {
    setUserToDelete(user);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setUserToDelete(null);
  };

  const crateChat = async (id) => {
    const data = {
      firstId: adminId,
      secondId: id,
    };
    createChat(data)
      .then(navigate("/dashboard-employee/chat"))
      .catch((error) => console.log(error));
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        จัดการผู้ใช้งาน
      </Typography>
      <FormGroup>
        <Stack direction={"row"} spacing={2}>
          <FormControlLabel
            control={
              <Checkbox
                name="isCheckedChecked"
                checked={isCheckedChecked}
                onChange={handleCheckboxChange}
              />
            }
            label="ตรวจสอบแล้ว"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="isCheckedPending"
                checked={isCheckedPending}
                onChange={handleCheckboxChange}
              />
            }
            label="รอตรวจสอบ"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="isCheckedEditing"
                checked={isCheckedEditing}
                onChange={handleCheckboxChange}
              />
            }
            label="รอแก้ไขข้อมูล"
          />
        </Stack>
      </FormGroup>

      <Container>
        {loading ? (
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Stack alignItems={"center"}>
              <CircularProgress />
              <Typography>กำลังโหลดข้อมูลข้อมูล</Typography>
            </Stack>
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead style={{ backgroundColor: "lightblue" }}>
                <TableRow>
                  <TableCell>รูปโปรไฟล์</TableCell>
                  <TableCell>ชื่อ</TableCell>
                  <TableCell>นามสกุล</TableCell>
                  <TableCell>ตำแหน่ง</TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    สถานะการตรวจสอบ
                  </TableCell>
                  <TableCell>สถานะการแบน</TableCell>
                  <TableCell style={{ textAlign: "center" }}>จัดการ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data
                  ? data
                      .filter(
                        (item) =>
                          item.role === "employee" || item.role === "owner"
                      )
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((item, index) => (
                        <TableRow key={index} hover>
                          <TableCell>
                            <Avatar
                              sx={{ width: 35, height: 35 }}
                              alt="Remy Sharp"
                              src={
                                `${baseURL}/uploads/avatar/` + item.avatarphoto
                              }
                            />
                          </TableCell>
                          <TableCell>{item.firstName}</TableCell>
                          <TableCell>{item.lastName}</TableCell>
                          <TableCell>{item.role}</TableCell>
                          <TableCell style={{ textAlign: "center" }}>
                            <Typography
                              variant="outlined"
                              style={{
                                color:
                                  item.statusVerify === "ตรวจสอบแล้ว"
                                    ? "green"
                                    : item.statusVerify === "รอตรวจสอบ"
                                    ? "red"
                                    : "orange",
                              }}
                            >
                              {item.statusVerify}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Switch
                              color="success"
                              defaultChecked={item.statusBlacklist}
                              onChange={(e) =>
                                handleOnChangeStatus(
                                  localStorage.getItem("token"),
                                  e,
                                  item._id
                                )
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Stack
                              direction={"row"}
                              spacing={1}
                              justifyContent={"center"}
                            >
                              <Button
                                variant="contained"
                                color="error"
                                onClick={() => handleClickOpen(item)}
                              >
                                ลบ
                              </Button>
                              <Button
                                variant="contained"
                                component={Link}
                                to={`/dashboard-admin/verify-user/${item._id}`}
                                style={{ textAlign: "center" }}
                                //disabled={item.statusVerify === "ตรวจสอบแล้ว"}
                              >
                                ตรวจสอบ
                              </Button>
                              <Button
                                variant="contained"
                                color="warning"
                                component={Link}
                                //to={`/dashboard-employee/chat`}
                                style={{ textAlign: "center" }}
                                onClick={() => crateChat(item._id)}
                                //disabled={item.statusVerify === "ตรวจสอบแล้ว"}
                              >
                                แชท
                              </Button>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))
                  : null}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[
                      10,
                      20,
                      30,
                      { label: "All", value: -1 },
                    ]}
                    colSpan={7}
                    count={data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
                      inputProps: {
                        "aria-label": "rows per page",
                      },
                      native: true,
                    }}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        )}
      </Container>
      <div>
        <Dialog
          open={open}
          TransitionComponent={Transition}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          PaperProps={{ style: { width: "1000px" } }}
        >
          <DialogTitle>{"ยืนยันการลบข้อมูลผู้ใช้งาน"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {userToDelete && (
                <>
                  <Stack direction={"row"} spacing={2}>
                    <Typography>ชื่อ:{userToDelete.firstName}</Typography>
                    <Typography>นามสกุล:{userToDelete.lastName}</Typography>
                    <Typography>ตำแหน่ง:{userToDelete.role}</Typography>
                  </Stack>
                </>
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
              startIcon={<DeleteForeverIcon />}
              color="error"
              onClick={() => handleRemoveUser(localStorage.getItem("token"))}
            >
              ลบข้อมูล
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}
