const router = require('express').Router();
const { Comment, User, Post } = require('../../models');

// Get all comments
router.get('/', (req, res) => {
  Comment.findAll({
      include: [
        {
          model: User,
          attributes: ['username']
        },
        {
          model: Post,
          attributes: ['title']
        }
      ]
    }
  )
  .then(dbCommentData => res.json(dbCommentData))
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  })
});

// Post a comment
router.post('/', (req, res) => {
  if(req.session) {
    Comment.create({
      post_id: req.body.post_id,
      comment_text: req.body.comment_text,
      user_id: req.body.user_id
    })
    .then(dbCommentData => res.json(dbCommentData))
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    })
  }
});

// Delete a comment
router.delete('/:id', (req, res) => {
  Comment.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(dbCommentData => {
    if(!dbCommentData) {
      res.status(404).json({ message: 'Comment not found!'});
      return;
    }
    res.json(dbCommentData);
  })
  .catch(err => {
    console.log(err);
    res.status(400).json(err);
  })
});

module.exports = router;