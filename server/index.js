const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./configs/database");
const path = require("path");

const auth = require("./routes/auth");
const user = require("./routes/user");
const company = require("./routes/company");
const work = require("./routes/work");
const review = require("./routes/review");
const report = require("./routes/report");
const chat = require("./routes/chat");
const message = require("./routes/message");
const unreadMessage = require("./routes/unreadMessage");

connectDB();

// Middlewares
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//route
app.use("/api", auth);
app.use("/api", user);
app.use("/api", company);
app.use("/api", work);
app.use("/api", review);
app.use("/api", report);
app.use("/api", chat);
app.use("/api", message);
app.use("/api", unreadMessage);

// connection
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server Running on Port ${port}`));
