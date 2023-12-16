import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Button, CardActionArea, Stack } from "@mui/material";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import CircularProgress from "@mui/material/CircularProgress";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import BadgeIcon from "@mui/icons-material/Badge";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";
import NotInterestedIcon from "@mui/icons-material/NotInterested";

import toast from "react-hot-toast";

import dayjs from "dayjs";
import "dayjs/locale/th";

import { Link } from "react-router-dom";
import { currentUser } from "../../../services/auth";
import { companyList, deleteCompany } from "../../../services/company";
import { profileUser } from "../../../services/user";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function CompanyAnnounce() {
  const [data, setData] = useState([]);
  const [companyId, setCompanyId] = useState([]);
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [workToDelete, setWorkToDelete] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    currentUser(token)
      .then((res) => {
        const id = res.data._id;
        setCompanyId(id);
        loadData(token, id);
        loadDataImage(token, id);
      })
      .catch((error) => console.log(error));
  }, []);

  const loadData = async (token, id) => {
    companyList(token, id)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  };

  const loadDataImage = async (token, id) => {
    profileUser(token, id)
      .then((res) => {
        setImage(res.data.companyphoto);
      })
      .catch((error) => console.log(error));
  };

  const handleDeleteCompany = async (token) => {
    if (workToDelete) {
      const values = {
        id: workToDelete._id,
      };
      deleteCompany(token, values)
        .then((res) => {
          toast.success(res.data);
          handleClose();
          loadData(token, companyId);
        })
        .catch((error) => console.log(error));
    }
  };

  const handleClickOpen = (user) => {
    setWorkToDelete(user);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setWorkToDelete(null);
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        ประกาศจ้างงาน
      </Typography>
      <Button
        component={Link}
        to={`/dashboard-owner/company-create/${companyId}`}
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
      >
        สร้างงาน
      </Button>
      {loading ? (
        <Stack alignItems={"center"}>
          <CircularProgress />
        </Stack>
      ) : data.length === 0 ? (
        <Typography variant="h6" align="center">
          ยังไม่มีประกาศจ้างงาน
        </Typography>
      ) : (
        <>
          <Stack
            direction={"column"}
            spacing={{ xl: 1, sm: 2, md: 4 }}
            justifyContent="center"
          >
            <Grid container spacing={2}>
              {data.map((item) => (
                <Grid key={item._id} item lg={3} sm={5} xs={12}>
                  <Card sx={{ maxWidth: 350 }}>
                    <CardActionArea>
                      <CardMedia
                        component="img"
                        height="140"
                        src={"http://localhost:5000/uploads/company/" + image}
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
                          <Stack direction={"row"} spacing={1}>
                            <Button
                              component={Link}
                              to={`/dashboard-owner/company-descrip/${item._id}`}
                              variant="contained"
                              color="success"
                              startIcon={<ContentPasteSearchIcon />}
                            >
                              ประกาศจ้าง
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              onClick={() => handleClickOpen(item)}
                              startIcon={<DeleteForeverIcon />}
                            >
                              ลบ
                            </Button>
                          </Stack>
                        </Stack>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Stack>
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
          <DialogTitle>{"ยืนยันการลบประกาศจ้างงาน"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {workToDelete && (
                <Stack>
                  <span>
                    วันที่:
                    {dayjs(workToDelete.workDay)
                      .locale("th")
                      .format("ddd DD MMM")}
                  </span>
                  <span>
                    เวลา:
                    {dayjs(workToDelete.workStartTime)
                      .locale("th")
                      .format("HH:mm")}{" "}
                    -{" "}
                    {dayjs(workToDelete.workEndTime)
                      .locale("th")
                      .format("HH:mm")}{" "}
                    น.
                  </span>
                  <span>ตำแหน่ง:{workToDelete.workPosition}</span>
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
              startIcon={<DeleteForeverIcon />}
              color="error"
              onClick={() => handleDeleteCompany(localStorage.getItem("token"))}
            >
              ยืนยัน
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}
