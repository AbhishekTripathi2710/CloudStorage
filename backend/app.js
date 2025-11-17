const express = require("express")
const app = express();
const authRoutes = require("./routes/authRoutes")
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");

app.use(cors());
app.use(express.json());
app.use(cookieParser());


app.use('/api',authRoutes);


module.exports = app;