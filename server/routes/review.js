const express = require("express");
const router = express.Router();

const { reviewEmployee, reviewOwner } = require("../controllers/review")

router.post("/reviewemployee", reviewEmployee);

router.post("/reviewowner", reviewOwner);

module.exports = router;