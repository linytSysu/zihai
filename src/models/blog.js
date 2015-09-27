var mongoose = require('mongoose');

BlogSchema = new mongoose.Schema ({
	title: String,
	author: String,
	url: String,
	content: String,
  preview: String,
	startDate: Date,
	updateDate: Date,
	tags: [{type: mongoose.Schema.Types.ObjectId, ref: 'Tag'}],
});

BlogSchema.virtual('updateTime').get(function() {
  var month, date, hour, minute;
  month = this.updateDate.getMonth() + 1 >= 10
    ? (this.updateDate.getMonth() + 1) + ""
    : "0" + (this.updateDate.getMonth() + 1);
  date = this.updateDate.getDate() >= 10
    ? this.updateDate.getDate() + ""
    : "0" + this.updateDate.getDate();
  hour = this.updateDate.getHours() >= 10
    ? this.updateDate.getHours() + ""
    : "0" + this.updateDate.getHours();
  minute = this.updateDate.getMinutes() >= 10
    ? this.updateDate.getMinutes() + ""
    : "0" + this.updateDate.getMinutes();
  return this.updateDate.getFullYear() + "/" + month + "/" + date + " " + hour + ":" + minute;
});

module.exports = mongoose.model('Blog', BlogSchema);
