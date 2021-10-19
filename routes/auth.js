const express = require('express');
const User = require('../models/User');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

const router = express.Router();

// REGISTER
router.post('/register', async (req, res) => {
	const password = req.body.password;

	const encryptPassword = CryptoJS.AES.encrypt(
		password,
		process.env.PASS_SEC
	).toString();

	const newUser = new User({
		username: req.body.username,
		email: req.body.email,
		password: encryptPassword,
	});

	try {
		const savedUser = await newUser.save();

		res.status(201).json(savedUser);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Login
router.post('/login', async (req, res) => {
	try {
		const user = await User.findOne({ username: req.body.username });

		!user && res.status(404).json({ message: 'User not found' });

		const hashedPass = CryptoJS.AES.decrypt(
			user.password,
			process.env.PASS_SEC
		);

		const password = hashedPass.toString(CryptoJS.enc.Utf8);

		if (password !== req.body.password) {
			res.status(403).json({ message: 'Invalid credentials' });
		} else {
			const accessToken = jwt.sign(
				{ id: user._id, isAdmin: user.isAdmin },
				process.env.JWT_SEC,
				{ expiresIn: '3d' }
			);

			const { password, ...other } = user._doc;

			res.status(200).json({ ...other, accessToken });
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

module.exports = router;
