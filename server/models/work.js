const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  employeeId: String,
  employeeFirstName: String,
  employeeLastName: String,
  employeeAvatar: String,
  employmentStatus: {
    type: String,
    default: 'รอคัดเลือก'
  },
  employmentStatusRe: {
    type: String,
    default: 'รอรีวิว'
  },
  ownermentStatusRe: {
    type: String,
    default: 'รอรีวิว'
  }
});

const workScheme = mongoose.Schema({
  companyId: String,
  companyName: String,
  workPosition: String,
  workDay: String,
  workStartTime: Date,
  workEndTime: Date,
  workBreakTime: Number,
  dailyWage: Number,
  numOfEmployee: Number,
  workScope: String,
  workWelfare: String,
  workDress: String,
  lat: Number,
  lng: Number,
  numOfReady: {
    type: Number,
    default: 0
  },
  companyphoto: String,
  employees: [employeeSchema],
}, { timestamps: true });

module.exports = mongoose.model("Work", workScheme);