const express = require('express');

const { readProducts, readProductsById, readProductsCount } = require("../controllers/shopifyProducts")

const { protect } = require("../middleware/auth");
const router = express.Router();

router.get("/", protect, readProducts);
router.get("/count", protect, readProductsCount);
router.get("/:product_id", protect, readProductsById);


// hilo-design


module.exports = router;