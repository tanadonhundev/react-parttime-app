const express = require("express");
const router = express.Router();

const { userList, statusBlacklistUser, statusVerify, removeUser, profileUser, profileEdit, loadPhoto } = require("../controllers/user");

const { auth } = require("../middleware/auth");

const { upload } = require("../middleware/upload");

router.get('/user', auth, userList);

router.post('/change-status', auth, statusBlacklistUser);

router.post('/verify-user/:id', auth, statusVerify);

router.delete('/user/:id', auth, removeUser);

router.get('/profile-user/:id', auth, profileUser);

router.get('/profile-photo/:id', auth, loadPhoto);

router.put('/profile-edit/:id', upload, profileEdit);


module.exports = router;