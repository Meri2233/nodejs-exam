const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    restaurandId:{
        type:String,
        require:true 
    },
    dishId:{
        type:Number,
        require:true
    },
    status:{
        type:String,
        default:"pending"
    },
    orderedAt:{
        type:Date,
        default:Date.now
    }
})

const orderModel = mongoose.model('order',orderSchema);
module.exports = orderModel;