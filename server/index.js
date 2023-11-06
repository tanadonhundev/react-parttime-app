const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./configs/database");
const path = require("path");

const auth = require("./routes/auth");
const user = require("./routes/user");
const company = require("./routes/company");
const work = require("./routes/work");

connectDB();

// Middlewares
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//route
app.use("/", auth);
app.use("/", user);
app.use("/", company);
app.use("/", work);

// connection
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server Running on Port ${port}`));
