'use strict';

const mongoose = require(`mongoose`),
	Users = mongoose.model(`Users`);

exports.listAllUsers = (req, res, next) => {
	Users.find({}, (err, user) => {
		if (err) {
			res.send(err);
		}
		let result = json(user);
		res.status(200).send(result);
	});
};

exports.createUser = (req, res) => {
	let newUser = new Users(req.body);

	newUser.save((err, user) => {
		if (err) {
			res.send(err);
		}
		res.json(user);
	});
};