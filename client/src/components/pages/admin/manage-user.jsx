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

import { useNavigate, Link } from "react-router-dom";

import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import NotInterestedIcon from "@mui/icons-material/NotInterested";

import toast from "react-hot-toast";

import {
  userList,
  removeUser,
  statusBlacklisUser,
} from "../../../services/user";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function ManageUser() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState([]);

  const baseURL = import.meta.env.VITE_API;

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    loadData(token);
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

  return (
    <>
      <Typography>d-manage-user</Typography>
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
            <Table aria-label="simple table">
              <TableHead style={{ backgroundColor: "lightblue" }}>
                <TableRow>
                  <TableCell>รูปโปรไฟล์</TableCell>
                  <TableCell>ชื่อ</TableCell>
                  <TableCell>นามสกุล</TableCell>
                  <TableCell>ตำแหน่ง</TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    การตรวจสอบ
                  </TableCell>
                  <TableCell>การแบน</TableCell>
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
                      .map((item, index) => (
                        <TableRow key={index}>
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
                                  item.statusVerify === "รอตรวจสอบ"
                                    ? "orange"
                                    : "green",
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
                              >
                                ดูข้อมูล
                              </Button>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))
                  : null}
              </TableBody>
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
              {userToDelete && <span>{userToDelete.email}</span>}
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
