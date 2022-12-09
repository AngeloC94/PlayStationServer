const router = require("express").Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_KEY)

const MY_DOMAIN = 'http://localhost:3000/cart';


router.post('/create-checkout-session', async (req, res) => {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "hoodie",
            },
            unit_amount: 7000,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${MY_DOMAIN}?success=true`,
      cancel_url: `${MY_DOMAIN}?canceled=true`,
    });
  
    res.send({url: session.url});
})

module.exports = router