const { ApiVersion } = require("@shopify/shopify-api");
const axios = require("axios");

const apiVersion = ApiVersion.October22


// ================= Get All Products ===================

exports.readProducts = async (req, res) =>{
    

    const result = await axios.get(`https://${process.env.API_KEY}:${process.env.SHOPIFY_TOKEN}@${process.env.SHOP}.myshopify.com/admin/api/${apiVersion}/products.json`);


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

// ================= Get Products by Id ===================

exports.readProductsById = async (req, res) =>{
    

    const result = await axios.get(`https://${process.env.API_KEY}:${process.env.SHOPIFY_TOKEN}@${process.env.SHOP}.myshopify.com/admin/api/${apiVersion}/products/${req.params.product_id}.json`);


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

// ====================== Retrieve Count of Products =========================
exports.readProductsCount = async (req, res) =>{
    

    const result = await axios.get(`https://${process.env.API_KEY}:${process.env.SHOPIFY_TOKEN}@${process.env.SHOP}.myshopify.com/admin/api/${apiVersion}/products/count.json`);


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