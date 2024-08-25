const express = require("express");
const router = express.Router();

const { registerUser, loginUser, currenUser, verifyEmail } = require("../controllers/auth");

const { auth } = require("../middleware/auth");


router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/current-user", auth, currenUser);

router.get("/verify-email/:token", verifyEmail);

module.exports = router;