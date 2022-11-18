const express = require('express');

const { readProducts, readProductsById, readProductsCount }  = require("../controllers/shopifyProducts")

const { protect } = require("../middleware/auth");
const router = express.Router();

router.get("/", readProducts);
router.get("/count", readProductsCount);
router.get("/:product_id", readProductsById);


// hilo-design


module.exports = router;