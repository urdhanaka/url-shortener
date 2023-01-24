const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const shortID = require('shortid');
const Url = require('./Url');
const utils = require('./Util/util');
const path = require('path')

dotenv.config({ path: __dirname + '/config/.env' });
const app = express();

app.use(cors());
app.use(express.json());

mongoose
	.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log('Database connected');
	})
	.catch((err) => {
		console.log(err.message);
	})

app.get("/", (req, res) => {
	res.send("Welcome!");
});

app.get("/test", (req, res) => {
	res.sendFile(path.join(__dirname, '..', "frontend", "index.html"));
});

app.get("/all", async (req, res) => {
	Url.find((error, data) => {
		if (error) {
			return next(error);
		} else {
			res.json(data);
		}
	});
});

app.get("/:ID", async (req, res) => {
	try {
		const url = await Url.findOne({ urlId: req.params.ID });
		console.log(url);
		if (url) {
			return res.redirect(url.origUrl);
		} else {
			res.status(404).json("Short link not found");
		}
	} catch (err) {
		res.status(500).json("Server error");
	}
})

app.post("/short", async (req, res) => {
	res.sendFile(path.join(__dirname + '/index.html'));
	const { origUrl } = req.body;	
	const BASE = process.env.DOMAIN_URL;
	const urlID = shortID.generate();
	if (utils.validateUrl(origUrl)) {
		try {
			const shortUrl = `${BASE}/${urlID}`;

			let url = new Url({
				origUrl,
				shortUrl,
				date: new Date(),
			});

			await url.save();
			res.json(url);
		} catch (err) {
			console.log(err.message);
			res.status(500).json('Database Error')
		}
	} else {
		console.log(err.message);
		res.status(400).json('Invalid url')
	}
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
	console.log(`Server is running at ${PORT}`);
})