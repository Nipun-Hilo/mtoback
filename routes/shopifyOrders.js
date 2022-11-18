const express = require('express');

const { readOrders, readOrdersById,
        readOrderCount}  = require("../controllers/shopifyOrders")

const { protect } = require("../middleware/auth");
const router = express.Router();

router.get("/", protect, readOrders);
router.get("/:order_id", protect, readOrdersById);
router.get("/count", protect, readOrderCount);


// hilo-design


module.exports = router;