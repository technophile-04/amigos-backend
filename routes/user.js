const express = require('express');
const {
	verifyToken,
	verifyTokenAndAuthorization,
	verifyTokeAndAdmin,
} = require('../middleware/verifyToken');
const CryptoJS = require('crypto-js');
const User = require('../models/User');

const router = express.Router();

router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
	if (req.body.password) {
		// req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC);​

		req.body.password = CryptoJS.AES.encrypt(
			req.body.password,
			process.env.PASS_SEC
		).toString();
	}

	try {
		const updatedUser = await User.findByIdAndUpdate(
			req.params.id,
			{
				$set: req.body,
			},
			{ new: true }
		);

		res.status(200).json(updatedUser);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// DELETE

router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
	try {
		await User.findByIdAndDelete(req.params.id);

		res.status(200).json({ message: 'User deleted successfully' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// GET
router.get('/find/:id', verifyTokeAndAdmin, async (req, res) => {
	try {
		const user = await User.findById(req.params.id);

		const { password, ...other } = user._doc;

		res.status(200).json({ ...other });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// GET ALL USERS
router.get('/', verifyTokeAndAdmin, async (req, res) => {
	const query = req.query.new;

	try {
		const users = query
			? await User.find().sort({ _id: -1 }).limit(5)
			: await User.find();

		res.status(200).json(users);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// GET User ALL stats

router.get('/stats', verifyTokeAndAdmin, async (req, res) => {
	const date = new Date();

	const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

	try {
		const data = await User.aggregate([
			{ $match: { createdAt: { $gte: lastYear } } },
			{
				$project: {
					month: { $month: '$createdAt' },
				},
			},
			{
				$group: {
					_id: '$month',
					total: { $sum: 1 },
				},
			},
		]);

		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

module.exports = router;
