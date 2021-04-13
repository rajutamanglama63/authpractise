const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

const connectDB = require("./config/db");
const todoRoute = require("./route/TodoRoute");
const userRoute = require("./route/UserRoute");

const app = express();

connectDB();

dotenv.config();
const Port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("Hello");
});

app.use("/api/todo", todoRoute);
app.use("/api/user", userRoute);

app.listen(Port, () => {
    console.log(`Server running on port http://localhost:${Port}`);
});