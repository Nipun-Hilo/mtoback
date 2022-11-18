const express = require('express');

const { readCustomers, 
    readCustomerById, 
    readCustomerCount, 
    readCustomerOrders, 
    searchCustomerByQuery }  = require("../controllers/shopifyCustomers")

const { protect } = require("../middleware/auth");
const router = express.Router();

router.get("/", readCustomers);
router.get("/count", readCustomerCount);
router.get("/:customer_id/orders", readCustomerOrders);
router.get("/:customer_id", readCustomerById);
router.get("/search/:query", searchCustomerByQuery);


// hilo-design


module.exports = router;