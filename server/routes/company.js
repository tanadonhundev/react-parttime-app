const express = require("express");
const router = express.Router();

const { createCompany, companyList, companyDescrip } = require("../controllers/conpany");

const { auth } = require("../middleware/auth");

router.post("/creatework", auth, createCompany);

router.get("/creatework/:id", auth, companyList);

router.get("/work-details/:id", auth,companyDescrip);

module.exports = router;