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
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

import BadgeIcon from "@mui/icons-material/Badge";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import HowToRegIcon from "@mui/icons-material/HowToReg";

import { Link } from "react-router-dom";

import dayjs from "dayjs";
import "dayjs/locale/th";

import { workList } from "../../../services/work";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function WorkAnnounce() {
  const [data, setData] = useState([]);
  const [work, setWork] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [workPositionChecked, setWorkPositionChecked] = useState({
    เสิร์ฟ: false,
    ล้างจาน: false,
    ครัว: false,
    แพ็คสินค้า: false,
    สต๊อกสินค้า: false,
    คัดแยกสินค้า: false,
  });
  const [open, setOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    loadData(token);
  }, []);

  const loadData = async (token) => {
    workList(token)
      .then((res) => {
        setData(res.data);
        const firstTabData = res.data[0];
        if (firstTabData) {
          // Initially, display data for the first date
          setWork([firstTabData]);
        }
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
    // Check if any Checkbox is selected
    const isAnyCheckboxSelected = Object.values(workPositionChecked).some(
      (checked) => checked
    );

    if (isAnyCheckboxSelected) {
      // Filter the data based on the selected checkboxes and the selected date
      const filteredData = data.filter((work) => {
        return (
          work.workDay === workDay && workPositionChecked[work.workPosition]
        );
      });
      setWork(filteredData);
    } else {
      // Set the work data based on the selected date only
      const dateFilteredData = data.filter((work) => work.workDay === workDay);
      setWork(dateFilteredData);
    }
    setSelectedTab(tabIndex);
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
      <Box component="form" noValidate>
        <p>Owner-home</p>
        <FormGroup>
          <Stack direction={"row"} spacing={1}>
            {Object.keys(workPositionChecked).map((position) => (
              <FormControlLabel
                key={position}
                control={
                  <Checkbox
                    checked={workPositionChecked[position]}
                    onChange={() => handleCheckboxChange(position)}
                  />
                }
                label={position}
              />
            ))}
          </Stack>
        </FormGroup>
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
        <Grid container spacing={2}>
          {work.map((item) => (
            <Grid key={item._id} item lg={3} sm={6} xs={12}>
              <Card sx={{ maxWidth: 350 }}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="140"
                    src={"http://localhost:5000/uploads/company/" + item.companyphoto}
                    alt="Company Image"
                  />
                  <CardContent>
                    <Stack direction={"column"} spacing={1}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="flex-start"
                      >
                        <Typography gutterBottom variant="h5" component="div">
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
                            .format("hh:mm")}
                        </Typography>
                        <Typography variant="body1">-</Typography>
                        <Typography variant="body1">
                          {dayjs(item.workEndTime).locale("th").format("hh:mm")}
                          น.
                        </Typography>
                      </Stack>
                      <Stack direction={"row"}>
                        <LocalAtmIcon />
                        <Typography variant="body1">
                          {item.dailyWage}บาท/ชั่วโมง
                        </Typography>
                      </Stack>
                      <Stack direction={"row"} justifyContent={"flex-end"}>
                        <Button
                          component={Link}
                          to={`/dashboard-employee/work-descrip/${item._id}`}
                          variant="contained"
                          color="success"
                          startIcon={<HowToRegIcon />}
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
      </Stack>
    </>
  );
}
