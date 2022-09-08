const express = require('express');
const router = express.Router();
const restaurantModel = require("../models/restaurants.model");
const multer = require('multer');
const { find } = require('../models/restaurants.model');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads")
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname)
    }
})

const uploads = multer({ storage: storage })

router.post('/add', uploads.single('logo'), async (req, res) => {
    const { name, ownerName } = req.body
    if (!name && !ownerName) {
        return res.status(400).send("All Fields are required");
    }
    const existingUser = await restaurantModel.findOne({ name: name });
    if (existingUser !== null) {
        return res.status(400).send("Restaurant Already Added");
    }
    let url = process.env.BASE_URL + "uploads/" + req.file.filename;

    const newRestaurant = new restaurantModel({
        name: name,
        ownerName: ownerName,
        logo: url
    })
    try {
        const addedRestaurant = await newRestaurant.save();
        res.status(200).send("Added Restaurant with id:" + addedRestaurant.id);
    }
    catch (e) {
        res.status(501).send(e.message);
    }
})
      
router.get("/getall", async (req, res) => {
    const restaurants = await restaurantModel.find({});
    res.status(200).send(restaurants);
})

router.get("/detail/:id", async (req, res) => {
    const selectedrestaurant = await restaurantModel.findOne({ _id: req.params.id });
    res.send(selectedrestaurant);
})

router.post("detail/:id/add-dish", async (req, res) => {
    const selectedrestaurant = await restaurantModel.findOne({ _id: req.params.id });
    const { name, price } = req.body;
    if (!name || !price) {
        return res.status(400).send("Enter All Fields");
    }
    if (!selectedrestaurant.dishes.find(el => el.name === name)) {
        return res.status(400).send("Dish already Added");
    }
    let dish = {
        name: name,
        price, price
    }
    selectedrestaurant.dishes.push(dish)
    await selectedrestaurant.save();
})


router.post("order/:id", async (req, res) => {
    const orders = await find({ restaurantId: req.params.id })
    res.status(200).send(orders);
})

module.exports = router;    