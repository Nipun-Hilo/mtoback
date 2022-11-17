const {verifyRequest}  = require("../middleware/verify-request");
const {applyAuthMiddleware}  = require("../middleware/shopifyAuth");
const { default: Shopify, ApiVersion } = require('@shopify/shopify-api');
const express = require("express");
const app = express();

exports.readProducts =   async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );
    const { Product } = await import(
      `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
    );

    const countData = await Product.count({ session });
    res.status(200).send(countData);
  };


const ACTIVE_SHOPIFY_SHOPS = {};

// the rest of the example code goes here

exports.shopify = async (req, res) => {
   // This shop hasn't been seen yet, go through OAuth to create a session
  if (ACTIVE_SHOPIFY_SHOPS[SHOP] !== undefined) {
     // not logged in, redirect to login
    res.redirect(`/login`);
  } else {
    res.send("Hello world!");
    // Load your app skeleton page with App Bridge, and do something amazing!
    res.end();
  }
};