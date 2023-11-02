const mongoose = require("mongoose");

const userScheme = mongoose.Schema({
    firstName: String,
    lastName: String,
    companyName: String,
    email: String,
    password: String,
    role: String,
    birthDay: String,
    age: Number,
    lat: Number,
    lng: Number,
    idCard: Number,
    phoneNumber: String,
    statusVerify: {
        type: String,
        default: 'รอตรวจสอบ'
    },
    statusBlacklist: {
        type: Boolean,
        default: 'true'
    },
    avatarphoto: String,
    idcardphoto: String,
}, { timestamps: true });

module.exports = mongoose.model("User", userScheme);