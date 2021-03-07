const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
		min: 6,
		max: 255
	},
	email: {
		type: String,
		required: true,
		min: 6,
		max: 255
	},
	password: {
		type: String,
		required: true,
		min: 6,
		max: 1024
	},
	date: {
		type: Date,
		default: Date.now
	},
	role :{
		type: String,
		required: true,
		min: 3,
		max : 255
	},
	image: {
		type: String,
		require: false
	}
});

module.exports = mongoose.model('User', UserSchema);