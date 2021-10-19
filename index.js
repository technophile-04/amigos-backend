const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const userRoute = require('./routes/user.js');

const app = express();

dotenv.config();

mongoose
	.connect(process.env.MONGO_URL)
	.then(() => console.log('Connected Backend to DB'))
	.catch((error) => console.log(error));

app.use(morgan('short'));
app.use(express.urlencoded());
app.use(express.json());

app.use('/api/users', userRoute);

app.get('/', (req, res) => {
	res.send('Hello world!');
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
	console.log('Listening on port:', port);
});