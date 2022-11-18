const express = require('express');

const { readOrders, readOrdersById,
        readOrderCount}  = require("../controllers/shopifyOrders")

const { protect } = require("../middleware/auth");
const router = express.Router();

router.get("/", readOrders);
router.get("/:order_id", readOrdersById);
router.get("/count", readOrderCount);


// hilo-design


module.exports = router;