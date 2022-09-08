const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const userModel = require('../models/user.model')

router.post('/signup', async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;
    if (!email || !password || !name || !confirmPassword) {
        return res.status(400).send("All Fields are required");
    }
    const existingUser = await userModel.findOne({ email: email });
    if (existingUser !== null) {
        return res.status(400).send("User Already exists");
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    console.log(hash);
    const newModel = new userModel({
        name: name,
        email: email,
        password: hash
    })
    try {
        const createdUser = await newModel.save();
        res.status(200).send("User Created with id:" + createdUser.id)
    }
    catch (e) {
        res.status(501).send(e.message);
    }
})

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send("All Fields are required");
    }
    const existingUser = await userModel.findOne({ email: email });
    if (existingUser === null) {
        return res.status(400).send("User doesnot exists");
    }
    if (!bcrypt.compareSync(password, existingUser.password)) {
        return res.status(400).send("Incorrect Password");
    }
    else {
        const payload = {
            id: existingUser.id,
            email: existingUser.email
        }
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET,{ expiresIn: "15s" });
        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET,{ expiresIn: "1d" });

        return res.status(200).json({
            accessToken: accessToken,
            refreshToken: refreshToken
        })
    }
})

router.post('/token', (req, res) => {
    const token = req.body.token;
    if (!token) {
        return res.status(400).send("Please provide Refresh Token");
    }
    try {
        const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        delete payload.exp; 
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15s" });
        res.status(400).json({ accessToken: accessToken });
    }
    catch (e) {
        res.status(501).send(e.message);
    }
})

module.exports = router;

