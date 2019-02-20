'use strict';
const mongoose = require(`mongoose`),
	Projects = mongoose.model(`Projects`);
const auth = require(`../../auth/authController`);

exports.addProject = (req, res) => {
	let token = req.headers[`x-access-token`];
	if (!token) return res.status(401).send({ auth: false, message: `No token provided` });
	let verifiedToken = auth.verifyToken(token, res);

	let hasAccess = auth.checkRights(verifiedToken.rank, `Student`);

	if (!hasAccess) return res.status(401).send({ access: false, message: `Not enough rights` });

	req.body.userID = verifiedToken.id;
	let newProject = new Projects(req.body);
	console.log(newProject);
	newProject.save((err, project) => {
		if (err) return res.status(500).send({ created: false, message: `Error: Project could not be created.`, error: err });
		return res.status(200).send({ created: true, message: `Project added` });
	});

}