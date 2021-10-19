const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
	const authHeader = req.headers.token;

	if (authHeader) {
		const token = authHeader.split(' ')[1];

		jwt.verify(token, process.env.JWT_SEC, (error, user) => {
			if (error) res.status(403).json({ message: 'Token is not valid' });

			req.user = user;

			next();
		});
	} else {
		return res.status(404).json({ message: 'You are not authenticated' });
	}
};

const verifyTokenAndAuthorization = (req, res, next) => {
	verifyToken(req, res, () => {
		if (req.user.id === req.params.id || req.user.isAdmin) {
			next();
		} else {
			res.status(403).json({ message: 'You are not allowed to do that!' });
		}
	});
};

const verifyTokeAndAdmin = (req, res, next) => {
	verifyToken(req, res, () => {
		if (req.user.isAdmin) {
			next();
		} else {
			res.status(403).json({ message: 'You are not allowed to do that!' });
		}
	});
};

module.exports = {
	verifyToken,
	verifyTokenAndAuthorization,
	verifyTokeAndAdmin,
};
