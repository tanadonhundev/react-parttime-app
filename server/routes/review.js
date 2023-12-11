const express = require("express");
const router = express.Router();

const { reviewEmployee, reviewOwner, getReviewEmployee } = require("../controllers/review");

const { auth } = require("../middleware/auth");

router.post("/reviewemployee", reviewEmployee);

router.post("/reviewowner", reviewOwner);

router.get('/reviewemployee/:id', auth, getReviewEmployee);

module.exports = router;