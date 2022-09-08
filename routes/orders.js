const express = require('express');
const router = express.Router();
const orderModel = require('../models/order.model');
const restaurantModel = require("../models/restaurants.model");
const dishModel = require("../models/dish.model");

router.post("add", (req, res) => {
    const { restaurantId, dishId } = req.body;
})

router.get('/detail/:id', async (req, res) => {
    const orders = await orderModel.find({ restaurantId: req.params.id });
    res.status(200).send(orders);
})

router.post("/update/:id", async (req, res) => {
    const { choice } = req.body
    if (choice === "Cancel") {
        await orderModel.findByIdAndUpdate(req.params.id, { status: "cancelled" });
        await orderModel.findByIdAndDelete(req.params.id);
        res.status(400).send("Order Cancelled");
    }
    else {
        await orderModel.findByIdAndUpdate(req.params.id, { status: "completed" });
        await orderModel.findByIdAndDelete(req.params.id);
        res.status(400).send("Order Completed");
    }
})

module.exports = router; 