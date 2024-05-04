const express = require("express");
const app = express();
const cors = require("cors");
const stripe = require("stripe")('sk_test_51NwojdSEOlkTsKuuucVGXGMfBkxhza7GYVtrnmS0cHLpU27hdEKNW2ch3RLbzsXB4jLVYclinlUkKj3bkCGKFKCk005gf1R5wq');
app.use(express.json());
app.use(cors());
// const subscriptionModel = require("./models/subscription");
require("./startup/errorLog")();
require("./startup/db")();
// require("./startup/config")();
require("./startup/routes")(app);
require('./startup/prod')(app);


app.post("/api/create-checkout-session",async(req,res)=>{
    console.log(req.body);
    const {products} = req.body;


    
    const lineItems = products.map((product)=>({
        price_data:{
            currency:"inr",
            product_data:{
                name:"Tiffin Tray",
                images:[]
            },
            unit_amount:product * 100,
        },
        quantity:1
    }));
   
     // subscriptionModel.paymentDone();

    const session = await stripe.checkout.sessions.create({
        payment_method_types:["card"],
        line_items:lineItems,
        mode:"payment",
        success_url:"http://localhost:3000/success",
        cancel_url:"http://localhost:3000/cancel",
    });
    
    res.json({id:session.id})
 
})



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server Active on port ${PORT}`));
