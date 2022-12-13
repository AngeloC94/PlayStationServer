const router = require("express").Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_KEY)

const MY_DOMAIN = 'http://localhost:3000/';


router.post('/create-checkout-session', async (req, res) => {
  const customer = await stripe.customers.create({
    metadata: {
      userId: JSON.stringify(req.body.userId),
      cart: JSON.stringify(req.body.product),
      quantities: JSON.stringify(req.body.counter),
    }
  })
  const line_items = req.body.product.map((item) => {
    return {
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name,
          images: [item.image], 
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
      shipping_address_collection: {
        allowed_countries: ["AC", "AD", "AE", "AF", "AG", "AI", "AL", "AM", "AO", "AQ", "AR", "AT", "AU", "AW", "AX", "AZ", "BA", "BB", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BL",
         "BM", "BN", "BO", "BQ", "BR", "BS", "BT", "BV", "BW", "BY", "BZ", "CA", "CD", "CF", "CG", "CH", "CI", "CK", "CL", "CM", "CN", "CO", "CR", "CV", "CW", "CY", "CZ", "DE", "DJ",
         "DK", "DM", "DO", "DZ", "EC", "EE", "EG", "EH", "ER", "ES", "ET", "FI", "FJ", "FK", "FO", "FR", "GA", "GB", "GD", "GE", "GF", "GG", "GH", "GI", "GL", "GM", "GN", "GP", "GQ",
         "GR", "GS", "GT", "GU", "GW", "GY", "HK", "HN", "HR", "HT", "HU", "ID", "IE", "IL", "IM", "IN", "IO", "IQ", "IS", "IT", "JE", "JM", "JO", "JP", "KE", "KG", "KH", "KI", "KM",
         "KN", "KR", "KW", "KY", "KZ", "LA", "LB", "LC", "LI", "LK", "LR", "LS", "LT", "LU", "LV", "LY", "MA", "MC", "MD", "ME", "MF", "MG", "MK", "ML", "MM", "MN", "MO", "MQ", "MR",
         "MS", "MT", "MU", "MV", "MW", "MX", "MY", "MZ", "NA", "NC", "NE", "NG", "NI", "NL", "NO", "NP", "NR", "NU", "NZ", "OM", "PA", "PE", "PF", "PG", "PH", "PK", "PL", "PM", "PN",
         "PR", "PS", "PT", "PY", "QA", "RE", "RO", "RS", "RU", "RW", "SA", "SB", "SC", "SE", "SG", "SH", "SI", "SJ", "SK", "SL", "SM", "SN", "SO", "SR", "SS", "ST", "SV", "SX", "SZ",
         "TA", "TC", "TD", "TF", "TG", "TH", "TJ", "TK", "TL", "TM", "TN", "TO", "TR", "TT", "TV", "TW", "TZ", "UA", "UG", "US", "UY", "UZ", "VA", "VC", "VE", "VG", "VN", "VU", "WF",
         "WS", "XK", "YE", "YT", "ZA", "ZM", "ZW", "ZZ"]
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 0,
              currency : "eur"
            },
            display_name: "Spedizione gratuita",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 10,
              },
              maximum: {
                unit: "business_day",
                value: 15,
              },
            }
          }
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 1500,
              currency : "eur"
            },
            display_name: "Spedizione rapida",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 1,
              },
              maximum: {
                unit: "business_day",
                value: 3,
              },
            }
          }
        }
      ],
      phone_number_collection: {
        enabled: true
      },
      customer: customer.id,
      line_items,
      mode: 'payment',
      success_url: `${MY_DOMAIN}products?success=true`,
      cancel_url: `${MY_DOMAIN}cart?canceled=true`,
    });
  
    res.send({url: session.url});
})

module.exports = router