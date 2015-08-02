var express = require('express');
var Blog = require('../models/Blog');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var blog = new Blog({title:'123'});
  blog.save(function(err) {
  	if (err) {
  		console.log("error");
  	} else {
  		console.log("success");
  	}
  });
  res.render('index', { title: 'Express' });
});

module.exports = router;
