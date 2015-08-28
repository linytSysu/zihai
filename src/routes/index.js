var express = require('express');
var Blog = require('../models/Blog');
var Tag = require('../models/Tag');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  /*Tag.find({}).exec(function(err, tags){
  });
  Tag.findOne({name: 'hello'}, function(err, obj) {
    if (err) {
      console.log('error');
    } else {
      if (obj == null) {
        var date = new Date();
        var tag = new Tag({
          name: 'hello',
          createDate: date,
          refTimes: 1,
        });
        tag.save(function(err) {
          if (err) {
            console.log(err);
          }
        });
      }
    }
  });
  Blog.findOne({title: 'Hello world'}, function(err, obj) {
    if (err) {
      console.log('error');
    } else {
      if (obj == null) {
        var date1 = new Date();
        Tag.findOne({name: 'hello'}, function(err, tag) {
          var blog = new Blog({
            title: 'Hello world',
            author: 'Lin Yiting',
            url: 'hello-world',
            content: 'Mongoose provides a straight-forward, schema-based solution to modeling your application data and includes built-in type casting, validation, query building, business logic hooks and more, out of the box.',
            startDate: date1,
            updateDate: date1,
            tags: [tag._id]
          });
          blog.save(function(err) {
            if (err) {
              console.log('error');
            }
          });
        });
      } else {
        console.log(obj.url);
      }
    }
  });

  Blog.find({}).populate({path: 'tags'}).exec(function(err, blogs){
    console.log(blogs[0].tags[0].name);
  });
*/
  Blog.find({}, function(err, blogs) {
    if (err) {
      console.log('error');
    } else {
      Tag.find({}, function(err, tags) {
          res.render('index', { title:'asdf', blogs: blogs, tags: tags});
      });
    }
  });
});

router.get('/blog/:name', function(req, res, next) {
  Blog.findOne({url: req.params.name}).populate({path: 'tags'}).exec(function(err, obj) {
    if (err) {
      console.log('error');
    } else {
      if (obj == null) {
        res.redirect('/');
      } else {
        Blog.find({}, function(err, blogs) {
          if (err) {
            console.log("error");
          } else {
            Tag.find({}, function(err, tags) {
              res.render('blog', { blogs: blogs, blog: obj, tags: tags});
            });
          }
        });
        // Blog.find({}, function(err, blogs) {
        //   if (err) {
        //     console.log('error');
        //   } else {
        //     Tag.find({}, function(err, tags) {
        //       res.render('blog', { blogs: blogs, blog: obj, tags: tags});
        //     });
        //   }
        // });
      }
    }
  });
});

router.get('/blog-create', function(req, res, next) {
  Blog.find({}, function(err, blogs) {
    if (err) {
      console.log('error');
    } else {
      Tag.find({}, function(err, tags) {
        res.render('create', { blogs: blogs, tags: tags});
      });
    }
  });
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

router.get('/tags', function(req, res, next) {
  Tag.find({}, function(err, tags) {
    if (err) {
      console.log('error');
    } else {
      res.json({tags: tags})
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