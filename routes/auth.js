const express = require('express');

const  {login} = require("../controllers/auth");

const { protect } = require("../middleware/auth");

const router = express.Router();

router.post('/login',login);

module.exports = router;