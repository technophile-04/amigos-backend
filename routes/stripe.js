const router = require('express').Router();

const stripe = require('stripe')(process.env.STRIPE_KEY);

router.post('/payment', async (req, res) => {
	stripe.charges.create(
		{
			source: req.body.tokenId,
			amount: req.body.amount,
			currency: 'inr',
		},
		(err, result) => {
			if (err) {
				res.status(500).json({ message: err.message });
			} else {
				res.status(200).json(result);
			}
		}
	);
});

module.exports = router;
