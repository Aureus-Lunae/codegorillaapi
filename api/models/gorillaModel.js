`use strict`;

const mongoose = require(`mongoose`);
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	email: {
		type: String,
		lowercase: true,
		index: true,
		unique: true,
		required: `Please add an email`
	},
	rights: {
		type: String,
		enum: [`User`, `Student`, `Coach`, `Super_Admin`],
		default: `User`
	},
	passwordHash: {
		type: String,
		required: `Provide a password`
	},
	firstName: String,
	lastName: String,
	specialty: String,
	foto: String,
	city: String,
	hobbies: String
});

module.exports = mongoose.model(`Users`, UserSchema);