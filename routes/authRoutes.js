const express = require("express");
const passport = require("passport");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
    try {
        const User = require("../models/User");

        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Username, email and password are required"
            });
        }

        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (existingUser) {
            return res.status(400).json({
                message: "Username or email already exists"
            });
        }

        const bcrypt = require("bcryptjs");

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Registration failed",
            error: error.message
        });
    }
});

// Login using Passport Local
router.post(
    "/login",
    passport.authenticate("local"),
    (req, res) => {
        res.status(200).json({
            message: "Login successful",
            user: {
                id: req.user._id,
                username: req.user.username,
                email: req.user.email
            }
        });
    }
);

// Logout
router.post("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({
                message: "Logout failed"
            });
        }

        res.status(200).json({
            message: "Logout successful"
        });
    });
});

module.exports = router;