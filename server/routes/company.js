const express = require("express");
const router = express.Router();

const { createCompany, deleteCompany, companyList, companyDescrip } = require("../controllers/conpany");

const { auth } = require("../middleware/auth");

router.post("/createcompany", auth, createCompany);

router.post("/deletecompany", auth, deleteCompany);

router.get("/companylist/:id", auth, companyList);

router.get("/companydescrip/:id", auth, companyDescrip);

module.exports = router;