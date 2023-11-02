const express = require("express");
const router = express.Router();

const { registerUser, loginUser, currenUser } = require("../controllers/auth");

const { auth } = require("../middleware/auth");


router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/current-user", auth, currenUser);

module.exports = router;