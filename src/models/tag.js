var mongoose = require('mongoose');

TagSchema = new mongoose.Schema ({
	name: String,
	createDate: Date,
	refTimes: Number,
	blogs: [{type: mongoose.Schema.Types.ObjectId, ref: 'Blog'}]
});

module.exports = mongoose.model('Tag', TagSchema);