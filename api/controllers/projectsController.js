'use strict';
const mongoose = require(`mongoose`),
	Projects = mongoose.model(`Projects`);
const auth = require(`../../auth/authController`);

exports.addProject = (req, res) => {
	let token = req.headers[`x-access-token`];
	if (!token) return res.status(401).send({ auth: false, message: `No token provided` });
	let verifiedToken = auth.verifyToken(token, res);
	if (!verifiedToken) return res.status(500).send({ auth: false, message: `Failed to authenticate token.` });

	let hasAccess = auth.checkRights(verifiedToken.rank, `Student`);

	if (!hasAccess) return res.status(401).send({ access: false, message: `Not enough rights` });

	req.body.userID = verifiedToken.id;
	req.body.programmingLanguages = req.body.programmingLanguages.toString().split(/, | ,|,/);
	let newProject = new Projects(req.body);
	console.log(newProject);
	newProject.save((err, project) => {
		if (err) return res.status(500).send({ created: false, message: `Error: Project could not be created.`, error: err });
		return res.status(200).send({ created: true, message: `Project added` });
	});
}

exports.showAllProjects = (req, res) => {
	const { sort, embed } = req.query
	let conditions = {};
	let options = {};
	const sortColumns = [`name`];
	let sortby = 0;

	if (sort) {
		sortby = sort.toLowerCase();
	}

	if (sortby === 0) {
		console.log(`not sorting`);
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

	console.log(`List All Projects`);
	let query = Projects.find(conditions, null, options);

	if (embed) {
		if (embed === `users`) {
			query = query.populate(`userID`, `-passwordHash`);
		}
	}

	query.exec((err, projects) => {
		if (err) {
			res.send(err);
		} else {
			let response = JSON.stringify({ "data": projects, "greetings": { "greeting": "Hallo Bob", "calls": `You have called this 666 times after server start` } });
			res.send(response);
		}
	});
}

exports.showAllProjectsFromUser = (req, res) => {
	const { sort } = req.query
	let conditions = { userID: req.params.userId };
	let options = {};
	const sortColumns = [`name`];
	let sortby = 0;

	if (sort) {
		sortby = sort.toLowerCase();
	}

	if (sortby !== 0) {
		console.log(sortby);
		if (!sortColumns.includes(sortby)) {
			console.log(`Error, does not exist`);
		} else {
			options.sort = {
				[sortby]: 1
			};
		}
	}

	console.log(`List All Projects from user`);
	let query = Projects.find(conditions, null, options);

	query.exec((err, projects) => {
		if (err) {
			res.send(err);
		} else {
			let response = JSON.stringify({ "data": projects });
			res.send(response);
		}
	});
}