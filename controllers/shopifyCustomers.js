const { ApiVersion } = require("@shopify/shopify-api");
const axios = require("axios");
const { query } = require("express");

const apiVersion = ApiVersion.October22
// ================= Get All Customer ===================

exports.readCustomers = async (req, res) =>{
    

    const result = await axios.get(`https://${process.env.API_KEY}:${process.env.SHOPIFY_TOKEN}@${process.env.SHOP}.myshopify.com/admin/api/${apiVersion}/customers.json`);

    if(!result){
        return res.status(404).json({
            success:false,
            data:{}
        });;
    }

    res.status(200).json({
        success:true,
        data:result.data
    });

}

// ================= Get Customer by Id ===================

exports.readCustomerById = async (req, res) =>{
    

    const result = await axios.get(`https://${process.env.API_KEY}:${process.env.SHOPIFY_TOKEN}@${process.env.SHOP}.myshopify.com/admin/api/${apiVersion}/customers.json/?ids=${req.params.customer_id}`);


    if(!result){
        return res.status(404).json({
            success:false,
            data:{}
        });;
    }

    res.status(200).json({
        success:true,
        data:result.data
    });

}

// ====================== Retrieve Count of Customers =========================
exports.readCustomerCount = async (req, res) =>{
    

    const result = await axios.get(`https://${process.env.API_KEY}:${process.env.SHOPIFY_TOKEN}@${process.env.SHOP}.myshopify.com/admin/api/${apiVersion}/customers/count.json`);


    if(!result){
        return res.status(404).json({
            success:false,
            data:{}
        });;
    }

    res.status(200).json({
        success:true,
        data:result.data
    });

}

// ====================== Retrieve Count of Customers =========================
exports.readCustomerOrders = async (req, res) =>{
    

    const result = await axios.get(`https://${process.env.API_KEY}:${process.env.SHOPIFY_TOKEN}@${process.env.SHOP}.myshopify.com/admin/api/${apiVersion}/customers/${req.params.customer_id}/orders.json`);


    if(!result){
        return res.status(404).json({
            success:false,
            data:{}
        });;
    }

    res.status(200).json({
        success:true,
        data:result.data
    });

}

// ====================== Retrieve results of customer by query =========================
exports.searchCustomerByQuery = async (req, res) =>{
    console.log(req.params.query);
    console.log("HELLO");
    const result = await axios.get(`https://${process.env.API_KEY}:${process.env.SHOPIFY_TOKEN}@${process.env.SHOP}.myshopify.com/admin/api/${apiVersion}/customers/search.json?query=${req.params.query}`);


    if(!result){
        return res.status(404).json({
            success:false,
            data:{}
        });;
    }

    res.status(200).json({
        success:true,
        data:result.data
    });

}