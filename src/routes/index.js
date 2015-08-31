var express = require('express');
var Blog = require('../models/Blog');
var Tag = require('../models/Tag');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/blogs', function(req, res, next) {
  Blog.find({}).populate({path: 'tags'}).exec(function(err, blogs) {
    if (err) {
      console.log('error');
    } else {
      res.render('blogs', {blogs: blogs});
    }
  });
});

router.get('/blog/:name', function(req, res, next) {
  Blog.findOne({url: req.params.name}).populate({path: 'tags'}).exec(function(err, blog) {
    if (err) {
      console.log('error');
    } else {
      res.render('blog', { blog: blog });
    }
  });
});

router.get('/blog-create', function(req, res, next) {
  res.render('create');
});

router.post('/blog-create', function(req, res, next) {
  var title = req.param('title');
  var url = req.param('url');
  var content = req.param('content');
  var tags = req.param('tags');
  var date = new Date();

  Tag.findOne({name: tags}, function(err, obj) {
    if (err) {
      console.log('error');
    } else {
      if (obj == null) {
        var date = new Date();
        var tag = new Tag({
          name : tags,
          createDate: date,
          refTimes: 0
        });
        tag.save(function(err, obj) {
          if (err) {
            console.log('error');
          } else {
            var newBlog = new Blog({
              title     : title,
              author    : 'linyiting',
              url       : url,
              content   : content,
              startDate : date,
              updateDate: date,
              tags      : obj.id
            });
            newBlog.save(function(err) {
              if(err) {
                console.log(err);
              } else {
                res.redirect('/');
              }
            });
          }
        });
      } else {
        var date = new Date();
        var newBlog = new Blog({
          title     : title,
          author    : 'linyiting',
          url       : url,
          content   : content,
          startDate : date,
          updateDate: date,
          tags      : obj.id
        });
        newBlog.save(function(err) {
          if(err) {
            console.log(err);
          } else {
            res.redirect('/');
          }
        });
      }
    }
  });
});

router.get('/alltags', function(req, res, next) {
  Tag.find({}, function(err, tags) {
    if (err) {
      console.log('error');
    } else {
      res.json({tags: tags})
    }
  });
});

router.get('/tags', function(req, res, next) {
  Tag.find({}, function(err, tags) {
    if (err) {
      console.log('error');
    } else {
      res.render('tags', {tags: tags});
    }
  });
});

router.get('/tag/:name', function(req, res, next) {
  var tagName = req.params.name;
  var blogsArr = new Array();
  Blog.find({}).populate({path: 'tags'}).exec(function(err, blogs){
    if (err) {
      console.log('error');
    } else {
      blogs.forEach(function(blog) {
        blog.tags.forEach(function(tag) {
          if (tag.name == tagName) {
            blogsArr.push(blog);
          }
        });
      });
      res.render('tag', {blogs: blogsArr});
    }
  });
});

module.exports = router;


// 1. 对于path中的变量，均可以使用req.params.xxxxx方法
// 2. 对于get请求的?xxxx=,使用req.query.xxxxx方法
// 3. 对于post请求中的变量，使用req.body.xxxxx方法
// 4. 以上三种情形，均可以使用req.param()方法，
//    所以说req.param()是req.query、req.body、以及req.params
//    获取参数的三种方式的封装。


// Mongoose: the difference between id and _id
// methods, static methods
// virtual