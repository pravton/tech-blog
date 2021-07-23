const router = require('express').Router();
const { Post, User, Comment } = require('../models');

router.get('/', (req, res) => {
  Post.findAll({
    order: [['created_at', 'DESC']],
    include: [
      {
        model: Comment,
        order: [['created_at', 'DESC']],
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username']
        }
      },
      {
        model: User,
        attributes: ['username']
      }
    ]
  })
    .then(dbPostData => {
      const posts = dbPostData.map(post => post.get({plain: true}));
      // pass a single post object into the homepage template
      res.render('homepage', {
        posts,
        loggedIn: req.session.loggedIn
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Get a single post
router.get('/posts/:id', (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id,
    },
    order: [[Comment, 'created_at', 'DESC']],
    include: [
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username']
        }
      },
      {
        model: User,
        attributes: ['username']
      },
    ]
  })
    .then(dbPostData => {
      const post = dbPostData.get({plain: true});
      console.log(post);
      post.content = post.content.split("\n");
  
      // pass a single post object into the homepage template
      res.render('single-post', {
        post,
        loggedIn: req.session.loggedIn
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Login route
router.get('/login', (req, res) => {
  if(req.session.loggedIn) {
    res.redirect('/dashboard');
    return;
  }
  res.render('login');
});

// signup route
router.get('/signup', (req, res) => {
  if(req.session.loggedIn) {
    res.redirect('/dashboard');
    return;
  }

  res.render('signup');
});


module.exports = router;