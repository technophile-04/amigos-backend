const express = require('express');
const {
	verifyTokeAndAdmin,
	verifyTokenAndAuthorization,
} = require('../middleware/verifyToken');
const Order = require('../models/Order');

const router = express.Router();

// Create Order
router.post('/', async (req, res) => {
	const newOrder = new Order(req.body);

	try {
		const savedOrder = await newOrder.save();
		res.status(200).json(savedOrder);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Update product

router.put('/:id', verifyTokeAndAdmin, async (req, res) => {
	try {
		const updatedOrder = await Order.findByIdAndUpdate(
			req.params.id,
			{
				$set: req.body,
			},
			{ new: true }
		);

		res.status(200).json(updatedOrder);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Delete products

router.delete('/:id', verifyTokeAndAdmin, async (req, res) => {
	try {
		await Order.findByIdAndDelete(req.params.id);

		res.status(200).json({ message: 'Order deleted' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Get Users order

router.get('/find/:userId', verifyTokenAndAuthorization, async (req, res) => {
	try {
		const orders = await Order.find();
		res.status(200).json(orders);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// GET ALL order

router.get('/', verifyTokeAndAdmin, async (req, res) => {
	try {
		const allOrders = await Order.find();
		res.status(200).json(allOrders);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// GET MONTHLY INCOME

router.get('/income', verifyTokeAndAdmin, async (req, res) => {
	const date = new Date();
	const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
	const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

	try {
		const income = await Order.aggregate([
			{ $match: { createdAt: { $gte: previousMonth } } },
			{
				$project: {
					month: { $month: '$createdAt' },
					sales: '$amount',
				},
			},
			{
				$group: {
					_id: '$month',
					total: { $sum: '$sales' },
				},
			},
		]);
		res.status(200).json(income);
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
