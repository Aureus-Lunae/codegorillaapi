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
			let response = JSON.stringify({ "data": projects });
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

exports.showProject = (req, res) => {
	let query = Projects.findOneAndUpdate({ _id: req.params.projectId }, {
		$inc: {
			views: 1
		}
	}, { new: true });
	query.exec((err, projects) => {
		if (err) return res.status(500).send({ message: `Error on the server.`, error: err });
		res.status(200).send({ "data": projects })
	});
}

//Edit Projects

const CheckIfProjectOwner = (hasAccess, projectId, userId) => {
	return new Promise((resolve, reject) => {
		if (hasAccess) {
			console.log(`Access granted`);
			resolve(true);
		} else {
			Projects.findById({ _id: projectId }, `userID`, (err, projectCheck) => {
				if (err) { reject(`There was a problem finding the project.`) };
				if (!projectCheck) { reject(`There was a problem finding the project.`) };
				console.log(projectCheck.userID);
				console.log(userId);
				if (projectCheck.userID == userId) {
					console.log(`Access granted`);
					resolve(true);
				} else {
					console.log(`No Access`);
					reject(false);
				}
			});
		}
	});
};

exports.editProject = (req, res) => {
	let token = req.headers[`x-access-token`];
	let conditions = { _id: req.params.projectId };
	let update = { $set: {} };

	//Check if authorized, or is the project of the person itself.
	if (!token) return res.status(401).send({ auth: false, message: `No token provided` });
	let verifiedToken = auth.verifyToken(token, res);

	if (!verifiedToken) {
		return res.status(401).send({ auth: false, message: `Failed to authenticate token.` });
	} else {

		let hasAccess = auth.checkRights(verifiedToken.rank, `Coach`);

		CheckIfProjectOwner(hasAccess, req.params.projectId, verifiedToken.id)
			.then((resolve) => {
				console.log(`Has Access`);

				// if (!hasAccess) return res.status(401).send({ auth: false, message: `Unauthorized Access` });

				console.log(req.body.name);

				if (req.body.name) {
					update.$set.name = req.body.name;
				}
				if (req.body.github) {
					update.$set.github = req.body.github;
				}
				if (req.body.site) {
					update.$set.site = req.body.site;
				}
				if (req.body.projectTime) {
					update.$set.projectTime = req.body.projectTime;
				}
				if (req.body.programmingLanguages) {
					update.$set.programmingLanguages = req.body.programmingLanguages.toString().split(/, | ,|,/);
				}

				console.log(update);
				let query = Projects.findOneAndUpdate(conditions, update, { new: true });

				query.exec((err, projects) => {
					if (err) return res.status(500).send({ message: `Error on the server.`, error: err });
					res.status(200).send({ "data": projects })
				});
			})
			.catch((error) => {
				console.log(error);
				if (error) {
					res.status(500).send({ Status: 500, error: error });
				} else {
					res.status(401).send({ Status: 401, error: `Unauthorized Access` });
				}
			});
	}

}