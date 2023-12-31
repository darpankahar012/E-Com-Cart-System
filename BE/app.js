const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors');
const dbConnect = require("./config/db/dbConnect");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const userRoutes = require("./routes/users");
const cartRoutes = require("./routes/cart");

//DB
dbConnect();

app.use("/uploads",express.static('uploads'));

//cors Preflight
app.use(cors ({
   origin: 'http://localhost:3000'
}));


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use((req, res, next)=>{
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers","Origin, X-Requested-with, Accept, Authorization");
   
   if(req.method == 'OPTIONS'){
       res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
       return res.status(200).json({});
   }
   
   next();
});

// Handle all routes-------------
app.use('/products',productRoutes);
app.use('/orders',orderRoutes);
app.use('/user',userRoutes);
app.use('/cart',cartRoutes);

app.use((req, res, next)=>{
   const error  = new Error();
   error.status = 404;
   next(error);
});

app.use((error, req, res, next)=>{
   res.status(error.status || 500);
   res.json({
       error:{
            message: error.message    
       }
   });
});

module.exports = app;