const express = require("express");
const router = express.Router();

const { postWork, workList, workDescrip, applyWork, workDescripList, applyList, ChangeEmploymentStatus, CancelWork, CancelWork1 } = require("../controllers/work");

const { auth } = require("../middleware/auth");

router.post('/postwork', auth, postWork);

router.post('/applyWork', auth, applyWork);

router.get('/workList', auth, workList);

router.get('/workList/:id', auth, workDescrip);

router.get('/workDescripList/:id', auth, workDescripList);

router.get('/applyList/:id', auth, applyList);

router.post('/employmentstatus', auth, ChangeEmploymentStatus);

router.post('/cancelwork', auth, CancelWork);

router.post('/cancelwork1', auth, CancelWork1);

module.exports = router;