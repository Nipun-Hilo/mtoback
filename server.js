const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");




// Route Files
const auth = require('./routes/auth');
const shopifyProducts = require("./routes/shopifyProducts");
const shopifyCustomers = require("./routes/shopifyCustomers");
const shopifyOrders = require("./routes/shopifyOrders");

// Initialising App
const app = express();

// Loading Env Vars
dotenv.config({ path: "./config/config.env" });



app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));



// ================Mount routes=====================

app.use('/api/v1/auth', auth );  
app.use('/api/v1/products', shopifyProducts);
app.use('/api/v1/customers', shopifyCustomers);
app.use('/api/v1/orders', shopifyOrders);


// ==================================================
app.get("/", (req, res) => {
    res.json({ message: "Welcome to Hilo Design" });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});