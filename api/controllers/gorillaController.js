'use strict';

const mongoose = require(`mongoose`),
	Users = mongoose.model(`Users`);
let listUserCalled = 0;
let UserDataCalled = 0;
let testCalled = 0;

/**
 * Functions for app.route(`/users`)
 */

exports.listAllUsers = (req, res, next) => {
	let query = ``;

	Users.find({}, `_id email firstName lastName specialty foto city hobbies rights`, (err, user) => {
		if (err) {
			res.send(err);
		} else {
			let response = JSON.stringify({ "data": user });
			listUserCalled++;
			console.log(`List All Users: ${listUserCalled}`);
			res.send(response);
		}
	});
};

exports.testlistAllUsers = (req, res, next) => {
	let query = ``;

	Users.find({}, `_id email firstName lastName specialty foto city hobbies rights`, (err, user) => {
		if (err) {
			res.send(err);
		} else {
			let response = JSON.stringify({ "data": user });
			listUserCalled++;
			console.log(`Test List: ${testCalled}`);
			res.send(response);
		}
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

/**
 * Functions for app.route(`/users/userId`)
 */
exports.readAnUser = (req, res, next) => {
	Users.findById(req.params.userId, `_id email firstName lastName specialty foto city hobbies rights`, (err, user) => {
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

exports.deleteAnUser = (req, res) => {
	Users.remove({ _id: req.params.userId }, (err, user) => {
		if (err) {
			res.send(err);
		} else {
			console.log(`Delete User`);
			res.json({ message: 'user succesfully deleted' });
		}
	});
};