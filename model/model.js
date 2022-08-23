const mongoose = require('mongoose');

const friendSchema = new mongoose.Schema({
	friendId: {
		type: Number,
		require: true,
	},
	friendName: {
		type: String,
	},
	messages: {
		type: String,
	},
});
let Friends = mongoose.model('Friends', friendSchema);
module.exports = { Friends };
