const mongoose = require('mongoose');

const restaurantSchema = mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    ownerName:{
        type:String,
        require:true
    },
    logo:{
        type:String
    },
    dishes:[{type:mongoose.Schema.Types.ObjectId,ref:'Ad'}],
    addedAt:{
        type:Date,
        default:Date.now
    }
});

const restaurantModel = mongoose.model('restaurants',restaurantSchema);
module.exports = restaurantModel;