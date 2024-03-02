const express = require("express");
const router = express.Router();

const { reportOwner } = require("../controllers/report");

//router.post("/reviewemployee", reviewEmployee);

router.post("/reportowner", reportOwner);

//router.get('/reviewemployee/:id', auth, getReviewEmployee);

//router.get('/reviewowner/:id', auth, getReviewOwner);

module.exports = router;