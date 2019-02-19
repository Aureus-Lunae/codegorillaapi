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
		type: [{
			type: String,
			enum: [`User`, `Student`, `Coach`, `Super Admin`]
		}],
		default: [`User`]
	},
	passwordHash: String,
	firstName: String,
	lastName: String,
	specialty: String,
	foto: String,
	hobbies: String
});

module.exports = mongoose.model(`Users`, UserSchema);