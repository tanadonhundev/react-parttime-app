const mongoose = require("mongoose");

const userScheme = mongoose.Schema({
    firstName: String,
    lastName: String,
    companyName: String,
    email: String,
    password: String,
    role: String,
    birthDay: Date,
    age: Number,
    idCard: Number,
    phoneNumber: String,
    houseNumber: String,
    groupNumber: Number,
    subDistrict: String,
    district: String,
    proVince: String,
    postCode: Number,
    companyHouseNumber: String,
    companyGroupNumber: Number,
    CompanySubDistrict: String,
    CompanyDistrict: String,
    CompanyProVince: String,
    CompanyPostCode: Number,
    statusVerify: {
        type: String,
        default: 'รอตรวจสอบ'
    },
    statusBlacklist: {
        type: Boolean,
        default: 'true'
    },
    lat: {
        type: Number,
        default: 13.7563
    },
    lng: {
        type: Number,
        default: 100.5018
    },
    avatarphoto: String,
    idcardphoto: String,
    companyphoto: String,
}, { timestamps: true });

module.exports = mongoose.model("User", userScheme);