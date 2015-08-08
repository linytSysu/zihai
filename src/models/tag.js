var mongoose = require('mongoose');

TagSchema = new mongoose.Schema ({
	name: String,
	createDate: Date,
	refTimes: Number,
});

module.exports = mongoose.model('Tag', TagSchema);