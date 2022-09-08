require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');

const corsOptions = {
    origin:"*",
    credentials:true,
    optionSuccessStatus:200
}

const DB_URI = "mongodb+srv://merika:86MD0rF53vaB51yF@cluster0.aaxhgxd.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(DB_URI,{
    useUnifiedTopology:true,
    useNewUrlParser:true
})
.then(()=>console.log("Connected to DB"))
.catch((e)=>console.log(e.message));

const authRouter = require('./routes/auth');
const orderRouter = require('./routes/orders');
const restaurantsRouter = require('./routes/restaurants')   
const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(cors(corsOptions));  
app.use(morgan('dev'));

app.use('/auth',authRouter);
app.use(authenticateRequest);  
app.use('/order',orderRouter);
app.use('/restaurant',restaurantsRouter);

app.listen(8000||process.env.PORT);

function authenticateRequest(req, res, next) {
    const authHeaderInfo = req.headers["authorization"];   

    if (authHeaderInfo === undefined) {
        return res.status(401).send("No token was provided");
    }
    const token = authHeaderInfo.split(" ")[1];
    if (token === undefined) {
        return res.status(401).send("Proper token was not provided");
    }
    try {
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.userInfo = payload;
        next();
    }
    catch (e) {
        res.status(401).send("Invalid token provided" + e.message);
    }
}