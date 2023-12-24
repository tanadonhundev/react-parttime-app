const express = require("express");
const router = express.Router();

const { reviewEmployee, reviewOwner, getReviewEmployee, getReviewOwner } = require("../controllers/review");

const { auth } = require("../middleware/auth");

router.post("/reviewemployee", reviewEmployee);

router.post("/reviewowner", reviewOwner);

router.get('/reviewemployee/:id', auth, getReviewEmployee);

router.get('/reviewowner/:id', auth, getReviewOwner);

module.exports = router;