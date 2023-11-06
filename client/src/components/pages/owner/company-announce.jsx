import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Button, CardActionArea, Stack } from "@mui/material";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import BadgeIcon from "@mui/icons-material/Badge";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";

import dayjs from "dayjs";
import "dayjs/locale/th";

import { Link } from "react-router-dom";
import { currentUser } from "../../../services/auth";
import { companyList } from "../../../services/company";

export default function CompanyAnnounce() {
  const [data, setData] = useState([]);
  const [companyId, setCompanyId] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    currentUser(token)
      .then((res) => {
        const id = res.data._id;
        setCompanyId(id);
        loadData(token, id);
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

  return (
    <>
      <div>job-posting</div>
      <Button
        component={Link}
        to={`/dashboard-owner/company-create/${companyId}`}
        variant="contained"
        color="primary"
      >
        สร้างงาน
      </Button>
      <Stack
        direction={"column"}
        spacing={{ xl: 1, sm: 2, md: 4 }}
        justifyContent="center"
      >
        <Grid container spacing={2}>
          {data.map((item) => (
            <Grid key={item._id} item lg={2} sm={4} xs={12}>
              <Card sx={{ maxWidth: 350 }}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="140"
                    src={
                      "http://localhost:5000/uploads/company/" +
                      item.companyphoto
                    }
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
                            .format("HH:mm")}
                        </Typography>
                        <Typography variant="body1">-</Typography>
                        <Typography variant="body1">
                          {dayjs(item.workEndTime).locale("th").format("HH:mm")}
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
                          component={Link}
                          to={`/dashboard-owner/work-details/${item._id}`}
                          variant="contained"
                          color="error"
                          startIcon={<ContentPasteSearchIcon />}
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
  );
}
