const express = require("express");
const router = require("express").Router();
const Stripe = require('stripe');
const { Order } = require("../models/Order");
const stripe = Stripe(process.env.STRIPE_KEY)

//create order
const createOrder= async(customer, data) =>{
    const items= JSON.parse(customer.metadata.cart)
    const quant= JSON.parse(customer.metadata.quantities)
    const newOrder = new Order({
        userId: customer.metadata.userId,
        customerId: data.customer,
        paymentIntentId: data.payment_intent,
        products: items,
        quantities: quant,
        subtotal: data.amount_subtotal,
        total: data.amount_total,
        shipping: data.customer_details,
        delivery_status: data.customer_details,
        payment_status: data.payment_status,
    });
    try{
        const saveOrder = await newOrder.save()
        console.log("processed order:", saveOrder)
    }catch(err){
        console.log(err)
    }
}
// get order
router.get('/order', async (req, res) => {
    try {
        // const order = await stripe.paymentIntents.list({
        //     limit: 3,
        //   });
        const order = await Order.find()
        res.status(200).json(order)
    } catch (error) {
        res.status(500).json(error)
    }
})

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = process.env.ENDPOINT_SEC;

router.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
  const sig = request.headers['stripe-signature'];
  let data;
  let eventType;
    if(endpointSecret){
        let event;
        try {
            event = stripe.webhooks.constructEvent(
                request.body, 
                sig, 
                endpointSecret
            );
            console.log("webhook verified")
        } catch (err) {
            console.log(`Webhook Error: ${err.message}`)
            response.status(400).send(`Webhook Error: ${err.message}`);
            return;
          }
          data=event.data.object;
          eventType=event.type;

    }else{
        data= request.body.data.object;
        eventType= request.body.type;
    }

    //handle the event

    if(eventType === "checkout.session.completed"){
        stripe.customers
        .retrieve(data.customer)
        .then((customer) => {
                console.log(customer)
                console.log(data)
                createOrder(customer, data)
            }
        )
        .catch(err => {
            console.log(err.message)
            
        })
    }

  // Return a 200 response to acknowledge receipt of the event
  response.send().end();
});



module.exports = router