const express = require("express");
const router = express.Router();

const { report, getReport } = require("../controllers/report");

//router.post("/reviewemployee", reviewEmployee);

router.post("/report", report);

router.get('/report', getReport);

//router.get('/reviewowner/:id', auth, getReviewOwner);

module.exports = router;