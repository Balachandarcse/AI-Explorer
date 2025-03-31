const express = require("express");
const mdb = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const axios = require("axios");
const User=require("./models/User");

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

mdb.connect(process.env.MONGO_URL)
    .then(() => console.log("DB connected successfully!"))
    .catch((err) => {
        console.error("Couldn't connect to DB:", err);
        process.exit(1);
    });

app.post("/signup", async (req, res) => {
    const { firstname, lastname, email, password } = req.body;

    if (!firstname || !lastname || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ firstname, lastname, email, password: hashedPassword });
        await newUser.save();

        return res.status(201).json({ message: "User registered successfully", isvalid: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", isvalid: false });
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found", isvalid: false });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials", isvalid: false });
        }

        // Generate JWT Token
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "1h" });

        return res.status(200).json({
            message: "Login successful",
            token,
            isvalid: true,
            user: { firstname: user.firstname, lastname: user.lastname, email: user.email }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", isvalid: false });
    }
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
