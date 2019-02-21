`use strict`;

const mongoose = require(`mongoose`);
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
	name: {
		type: String,
		required: `Please add a project name`
	},
	userID: { type: Schema.Types.ObjectId, ref: `Users` },
	github: String,
	site: String,
	views: {
		type: Number,
		default: 0
	},
	programmingLanguages: Array,
	projectTime: String
});

ProjectSchema.post('find', function() {
	this.populate(`UserID`);
});

module.exports = mongoose.model(`Projects`, ProjectSchema);