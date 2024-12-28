const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config({ path: "./config/.env" });
require("./config/db");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");

const userRoutes = require("./routers/UserRoutes");
const postRoutes = require("./routers/PostRoutes"); // Adjust the path to your post routes

app.use(cors())
app.use(cookieParser());
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);
app.use('/api/posts', postRoutes);
app.listen(5000, () => {
    console.log('Server running on port 5000');
});