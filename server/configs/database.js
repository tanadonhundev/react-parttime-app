const mongoose = require("mongoose");
require('dotenv').config();

const url = process.env.DATABASE;

const connectDB = async () => {
    try {
        await mongoose.connect(url);
        console.log("DB Connected")
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectDB;