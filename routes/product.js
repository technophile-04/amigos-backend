const express = require('express');
const { verifyTokeAndAdmin } = require('../middleware/verifyToken');
const Product = require('../models/Product');

const router = express.Router();

// Create Post
router.post('/', verifyTokeAndAdmin, async (req, res) => {
	const newProduct = new Product(req.body);

	try {
		const savedProduct = await newProduct.save();
		res.status(200).json(savedProduct);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Update product

router.put('/:id', verifyTokeAndAdmin, async (req, res) => {
	try {
		const updatedProduct = await Product.findByIdAndUpdate(
			req.params.id,
			{
				$set: req.body,
			},
			{ new: true }
		);

		res.status(200).json(updatedProduct);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Delete products

router.delete('/:id', verifyTokeAndAdmin, async (req, res) => {
	try {
		await Product.findByIdAndDelete(req.params.id);

		res.status(200).json({ message: 'Product deleted' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Get Products

router.get('/find/:id', async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		res.status(200).json(product);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// GET ALL PRODUCTS
router.get('/', async (req, res) => {
	const qNew = req.query.new;
	const qCatergory = req.query.catergory;

	try {
		let products = [];

		if (qNew) {
			products = await Product.find().sort({ CreatedAt: -1 }).limit(5);
		} else if (qCatergory) {
			products = await Product.find({
				catergories: {
					$in: [qCatergory],
				},
			});
		} else {
			products = await Product.find();
		}

		res.status(200).json(products);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

module.exports = router;
