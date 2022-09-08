const mongoose = require('mongoose');

const dishSchema = mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    price:{
        type:Number,
        require:true
    },
    restaurantId:{
        type:String,
        ref:'restaurants',
        require:true
    },
    addedAt:{
        type:Date,
        default:Date.now
    }
})

const dishModel = mongoose.model('dishes',dishSchema);
module.exports = dishModel