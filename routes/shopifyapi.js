const express = require('express');

const  {readProducts, shopify} = require("../controllers/shopifyApi");

const { protect } = require("../middleware/auth");

const router = express.Router();
// hilo-design
router.get('/products-count',readProducts);
router.get('/shopify',shopify);

module.exports = router;