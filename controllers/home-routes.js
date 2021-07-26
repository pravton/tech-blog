const router = require('express').Router();
const { Post, User, Comment } = require('../models');

//find popular posts based on comments
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
      const totalPosts = [[], []];
      if(posts.length > 5) {
        // Get the latest 5 posts for slider
        for(let i = 0; i < 5; i++) {
          totalPosts[0].push(posts[i]);
        }
        // Get the rest of the posts for popular posts
        for(let i = 6; i < posts.length; i++) {
          totalPosts[1].push(posts[i]);
        }
      } else {
        totalPosts[0].push(posts[0]);
        for(let i = 1; i < posts.length; i++) {
          totalPosts[1].push(posts[i]);
        }
      }

      //sort the popular posts based on the comments 
      totalPosts[1].sort(function(a, b) {
        return b.comments.length - a.comments.length ;
      });

      res.render('homepage', {
        totalPosts,
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