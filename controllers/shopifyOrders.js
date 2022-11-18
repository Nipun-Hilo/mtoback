const { ApiVersion } = require("@shopify/shopify-api");
const axios = require("axios");

const apiVersion = ApiVersion.October22


// ================= Get All Orders ===================

exports.readOrders = async (req, res) =>{
    
    const add = req.query.since_id ? `?since_id=${req.query.since_id}` : "";
    
    const result = await axios.get(`https://${process.env.API_KEY}:${process.env.SHOPIFY_TOKEN}@${process.env.SHOP}.myshopify.com/admin/api/${apiVersion}/orders.json${add}`);

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

// ================= Get Orders by id ===================

exports.readOrdersById = async (req, res) =>{
    
    
    
    const result = await axios.get(`https://${process.env.API_KEY}:${process.env.SHOPIFY_TOKEN}@${process.env.SHOP}.myshopify.com/admin/api/${apiVersion}/orders/${req.params.order_id}.json`);

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

// ================= Get Orders Count ===================

exports.readOrderCount = async (req, res) =>{
    

    const result = await axios.get(`https://${process.env.API_KEY}:${process.env.SHOPIFY_TOKEN}@${process.env.SHOP}.myshopify.com/admin/api/${apiVersion}/orders/count.json?financial_status=authorized`);

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