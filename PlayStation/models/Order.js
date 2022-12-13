const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: {type: String, require: true},
    customerId: {type: String},
    paymentInentId: {type: String},
    products: [
        {
            name: {type: String},
            number: {type: String},
            price:{type: String},
            image:{type: String},
            price:{type: String},
        }
    
    ],
    quantities: [
        {
            name: {type: String},
            quantity: {type: Number}
        }
    ],
    subtotal: {type: Number, required: true},
    total: {type: Number, required: true},
    shipping: {type: Object, required: true},
    delivery_status: {type: Object, default: "pending"},
    payment_status: {type: String, required: true},
},
{timestamps: true})

const Order= mongoose.model("Order", orderSchema)
exports.Order = Order