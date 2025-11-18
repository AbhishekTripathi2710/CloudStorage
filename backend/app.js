const express = require("express")
const app = express();
const authRoutes = require("./routes/authRoutes")
const folderRoutes = require("./routes/folderRoutes")
const fileRoute = require("./routes/fileRoutes");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");

app.use(
  cors({
    origin: "http://localhost:5173",   
    credentials: true,                 
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(cookieParser());


app.use('/api',authRoutes);
app.use("/api/folders",folderRoutes)
app.use("/api/files",fileRoute)

module.exports = app;