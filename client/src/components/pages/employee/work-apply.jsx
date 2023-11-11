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

import { applyList, workList } from "../../../services/work";
import { currentUser } from "../../../services/auth";
import { loadPhoto } from "../../../services/user";

export default function WorkApply() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);
  const [companyId, setCompanyId] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [image, setImage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    currentUser(token)
      .then((res) => {
        const id = res.data._id;
        loadData(token, id);
        loadDataCompany(token);
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

  const loadData = async (token, id) => {
    applyList(token, id)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((error) => console.log(error));
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

  const uniqueDates = Array.from(
    new Set(data.map((item) => item.workDay))
  ).sort((a, b) => (dayjs(a).isBefore(dayjs(b)) ? -1 : 1));

  const onSubmit = (date, index) => {
    setSelectedTab(index);
  };

  return (
    <>
      <Box component="form" noValidate>
        <p>Owner-home</p>
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
          {filteredData.map((item) => (
            <Grid key={item._id} item lg={3} sm={6} xs={12}>
              <Card sx={{ maxWidth: 350 }}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="140"
                    src={`http://localhost:5000/uploads/company/${
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
                        {item.employees[0].employmentStatus === "รอยืนยัน" ? (
                          <Button
                            component={Link}
                            variant="contained"
                            color="warning"
                          >
                            รอยืนยัน
                          </Button>
                        ) : item.employees[0].employmentStatus === "เต็ม" ? (
                          <Button
                            component={Link}
                            variant="contained"
                            color="error"
                          >
                            เต็ม
                          </Button>
                        ) : (
                          <Button
                            component={Link}
                            variant="contained"
                            color="success"
                          >
                            ยืนยัน
                          </Button>
                        )}
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
