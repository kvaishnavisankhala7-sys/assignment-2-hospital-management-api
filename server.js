require("dotenv").config();

const express = require("express");
const session = require("express-session");
const passport = require("./auth");
const connectDB = require("./db");

const authRoutes = require("./routes/authRoutes");
const hospitalRoutes = require("./routes/hospitalRoutes");

const app = express();

connectDB();

app.use(express.json());

app.use(
    session({
        secret: process.env.SESSION_SECRET || "hospital-secret",
        resave: false,
        saveUninitialized: false
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to Hospital API"
    });
});

app.use("/auth", authRoutes);
app.use("/hospitals", hospitalRoutes);

app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});