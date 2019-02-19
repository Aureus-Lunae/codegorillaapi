'use strict';

const mongoose = require(`mongoose`),
	Users = mongoose.model(`Users`);
let listUserCalled = 0;
let UserDataCalled = 0;

exports.listAllUsers = (req, res, next) => {
	Users.find({}, (err, user) => {
		if (err) {
			res.send(err);
		}
		let response = JSON.stringify({ "data": user });
		listUserCalled++;
		console.log(`List All Users: ${listUserCalled}`);
		res.send(response);
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

exports.readAnUser = (req, res, next) => {
	Users.findById(req.params.userId, (err, user) => {
		if (err) {
			res.send(err);
		} else {
			let response = JSON.stringify({ "data": user });
			UserDataCalled++;
			console.log(`List User: ${UserDataCalled}`);
			res.send(response);
		}
	});
};