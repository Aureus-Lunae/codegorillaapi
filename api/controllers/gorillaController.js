'use strict';
const bcrypt = require(`bcryptjs`);
const mongoose = require(`mongoose`),
	Users = mongoose.model(`Users`);
const jwt = require(`jsonwebtoken`);
const config = require(`../../config`);
const auth = require(`../../auth/authController`)
let listUserCalled = 0;
let UserDataCalled = 0;
let testCalled = 0;

/**
 * Functions for app.route(`/users`)
 */

exports.listAllUsers = (req, res, next) => {
	const { rank, sort } = req.query
	let query = {};
	let options = {};
	const sortColumns = [`firstName`, `lastName`];
	let sortby = 0;

	if (rank) {
		query.rights = rank.charAt(0).toUpperCase() + rank.slice(1);
	}

	if (sort) {
		sortby = sort.toLowerCase();
		if (sortby === `firstname`) {
			sortby = `firstName`;
		}
		if (sortby === `lastname`) {
			sortby = `lastName`;
		}
	}

	if (sortby === 0) {
		console.log(`undefined`);
	} else {
		console.log(sortby);
		if (!sortColumns.includes(sortby)) {
			console.log(`Error, does not exist`);
		} else {
			options.sort = {
				[sortby]: 1
			};
		}
	}

	listUserCalled++;
	console.log(`List All Users: ${listUserCalled}`);

	Users.find(query, `_id email firstName lastName specialty foto city hobbies rights`, options, (err, user) => {
		if (err) {
			res.send(err);
		} else {
			let response = JSON.stringify({ "data": user, "greetings": { "greeting": "Hallo Bob", "calls": `You have called this ${listUserCalled} times after server start` } });
			res.send(response);
		}
	});
};

exports.testlistAllUsers = (req, res, next) => {
	const { rank, sort } = req.query
	let query = {};
	let options = {};
	const sortColumns = [`firstName`, `lastName`];
	let sortby = 0;

	if (rank) {
		query.rights = rank.charAt(0).toUpperCase() + rank.slice(1);
	}

	if (sort) {
		sortby = sort.toLowerCase();
		if (sortby === `firstname`) {
			sortby = `firstName`;
		}
		if (sortby === `lastname`) {
			sortby = `lastName`;
		}
	}

	if (sortby === 0) {
		console.log(`undefined`);
	} else {
		console.log(sortby);
		if (!sortColumns.includes(sortby)) {
			console.log(`Error, does not exist`);
		} else {
			options.sort = {
				[sortby]: 1
			};
		}
	}

	console.log(query);
	console.log(`Options below:`);
	console.log(options);
	testCalled++;
	console.log(`Test List: ${testCalled}`);
	Users.find(query, `_id email firstName lastName specialty foto city hobbies rights`, options, (err, user) => {
		if (err) {
			res.send(err);
		} else {
			let response = JSON.stringify({ "data": user });
			res.send(response);
		}
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

exports.getOwnData = (req, res) => {
	console.log(req.headers);
	let token = req.headers[`x-access-token`];
	console.log(token);
	if (!token) return res.status(401).send({ auth: false, message: `No token provided` });

	let verifiedToken = auth.verifyToken(token, res);

	Users.findById(verifiedToken.id, `_id email firstName lastName specialty foto city hobbies rights`, (err, user) => {
		if (err) return res.status(500).send(`There was a problem finding the user.`);
		if (!user) return res.status(500).send({ auth: false, message: `Failed to authenticate token.`, error: err });

		res.status(200).send({ "data": user });
	});
}