const express = require('express');

const { readCustomers, 
    readCustomerById, 
    readCustomerCount, 
    readCustomerOrders, 
    searchCustomerByQuery }  = require("../controllers/shopifyCustomers")

const { protect } = require("../middleware/auth");
const router = express.Router();

router.get("/", protect, readCustomers);
router.get("/count", protect, readCustomerCount);
router.get("/:customer_id/orders", protect, readCustomerOrders);
router.get("/:customer_id", protect, readCustomerById);
router.get("/search/:query", protect, searchCustomerByQuery);


// hilo-design


module.exports = router;