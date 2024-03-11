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
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";

import dayjs from "dayjs";

import { getReport } from "../../../services/report";

export default function ReportPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const baseURL = import.meta.env.VITE_API;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    getReport(token)
      .then((res) => {
        //console.log(res.data);
        setData(res.data);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <>
      <Typography variant="h6" gutterBottom>
        ดูการแจ้งปัญหา
      </Typography>
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
                  <TableCell style={{ textAlign: "center" }}>
                    รูปโปรไฟล์
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    ผู้แจ้งปัญหา
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>ตำแหน่ง</TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    รูปโปรไฟล์
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    ผู้ถูกแจ้งปัญหา
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>ตำแหน่ง</TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    วันเวลาที่แจ้ง
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    รายละเอียดการแจ้งปัญหา
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data
                  ? data
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((item, index) => (
                        <TableRow key={index} hover>
                          <TableCell>
                            <Avatar
                              sx={{
                                width: 35,
                                height: 35,
                                margin: "auto",
                              }}
                              alt="Remy Sharp"
                              src={
                                `${baseURL}/uploads/avatar/` +
                                item.peopleReporterInfo.avatarphoto
                              }
                            />
                          </TableCell>
                          <TableCell style={{ textAlign: "center" }}>
                            {item.peopleReporterInfo.firstName}{" "}
                            {item.peopleReporterInfo.lastName}
                          </TableCell>
                          <TableCell style={{ textAlign: "center" }}>
                            {item.peopleReporterInfo.role}
                          </TableCell>
                          <TableCell style={{ textAlign: "center" }}>
                            <Avatar
                              sx={{
                                width: 35,
                                height: 35,
                                margin: "auto",
                              }}
                              alt="Remy Sharp"
                              src={
                                `${baseURL}/uploads/avatar/` +
                                item.reporterInfo.avatarphoto
                              }
                            />
                          </TableCell>
                          <TableCell style={{ textAlign: "center" }}>
                            {item.reporterInfo.firstName}{" "}
                            {item.reporterInfo.lastName}
                          </TableCell>
                          <TableCell style={{ textAlign: "center" }}>
                            {item.reporterInfo.role}
                          </TableCell>
                          <TableCell style={{ textAlign: "center" }}>
                            {dayjs(item.createdAt).format(
                              "DD/MM/YYYY HH:mm:ss"
                            )}
                          </TableCell>
                          <TableCell style={{ textAlign: "center" }}>
                            {item.reportText}
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
                    colSpan={8}
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
    </>
  );
}
