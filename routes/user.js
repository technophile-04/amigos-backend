const express = require('express');
const {
	verifyToken,
	verifyTokenAndAuthorization,
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

module.exports = router;
