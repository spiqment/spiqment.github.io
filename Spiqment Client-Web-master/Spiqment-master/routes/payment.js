/*
const router = require("express").Router();

const stripe = require("stripe")(
  "sk_test_51MgPwMIWFUYrB61QtdwKvMhumfyeXYhroq2V2rEipCXXE3eK4pwqVNS5MspzgJ4LWc5hUIhqm5rCDEh84ARFVzUY00fwET9jB1"
);

// API for PAYMENT

router.post("/create", async (req, res) => {
  try{
  const total = req.body.amount;
  console.log("Payment Request recieved for this ruppess", total);  
  res.send(total)
}
catch(error) {
  console.log(error)
}


  /*const payment = await stripe.paymentIntents.create({
    amount: total * 100,
    currency: 'usd',
    automatic_payment_methods: {enabled: true},
  });
  

  res.status(201).send({
    clientSecret: payment.client_secret,
  });
  
});

module.exports = router;
*/

const router = require("express").Router();

const stripe = require("stripe")(
  "sk_test_51MgPwMIWFUYrB61QtdwKvMhumfyeXYhroq2V2rEipCXXE3eK4pwqVNS5MspzgJ4LWc5hUIhqm5rCDEh84ARFVzUY00fwET9jB1"
);

router.post("/create", async (req, res) => {
  const total = req.body.amount;
  console.log("Payment Request recieved for this ruppess", total);

  const payment = await stripe.paymentIntents.create({
    amount: total * 100,
    currency: "usd",
  });

  console.log("payment id >>>>>>", payment.id)

  res.status(201).send({
    clientSecret: payment.client_secret,
  });
});


module.exports = router;
