const router = require("express").Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_KEY)

const MY_DOMAIN = 'http://localhost:3000/';


router.post('/create-checkout-session', async (req, res) => {
  const line_items = req.body.product.map((item) => {
    return {
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name,
          // images: [item.image],    //non funziona ma funzionerà
          description: req.body.size.find(s => s.name === item.name)?.size,
          metadata: {
            id: item.number
          }
        },
        unit_amount: item.price * 100,
      },
      quantity: req.body.counter.find(c => c.name === item.name).quantity,
    }
  })  
  const session = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      success_url: `${MY_DOMAIN}`,
      cancel_url: `${MY_DOMAIN}cart`,
    });
  
    res.send({url: session.url});
})

module.exports = router