const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

// Find all posts entered by user
router.get('/', (req, res) => {
  Post.findAll({
    where: {
      // use the id from the session
      user_id: req.session.user_id
    },
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
      }
    ]
  })
  .then(dbPostData => {
    // searialize date before passing to template
    const posts = dbPostData.map(post => post.get({plain: true}));
    res.render('dashboard', { posts, loggedIn: req.session.loggedIn});
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  })
});

// edit a post
router.get('/edit/:id', (req, res) => {
  Post.findOne({
    where:  {
      id: req.params.id
  },
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
    }
  ]
})
  .then(dbPostData => {
    // searialize date before passing to template
    const post = dbPostData.get({plain: true});
    res.render('edit-post', { post });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  })
});

module.exports = router;