const express = require('express');
const {
	verifyTokeAndAdmin,
	verifyTokenAndAuthorization,
} = require('../middleware/verifyToken');
const Cart = require('../models/Cart');

const router = express.Router();

// Create Product
router.post('/', async (req, res) => {
	const newCart = new Cart(req.body);

	try {
		const savedCart = await newCart.save();
		res.status(200).json(savedCart);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Update product

router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
	try {
		const updatedCart = await Cart.findByIdAndUpdate(
			req.params.id,
			{
				$set: req.body,
			},
			{ new: true }
		);

		res.status(200).json(updatedCart);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Delete products

router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
	try {
		await Cart.findByIdAndDelete(req.params.id);

		res.status(200).json({ message: 'Cart deleted' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Get User Cart

router.get('/find/:userId', verifyTokenAndAuthorization, async (req, res) => {
	try {
		const cart = await Cart.findOne({ userId: req.params.userId });
		res.status(200).json(cart);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// GET ALL

router.get('/', verifyTokeAndAdmin, async (req, res) => {
	try {
		const allCarts = await Cart.find();
		res.status(200).json(allCarts);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

module.exports = router;
