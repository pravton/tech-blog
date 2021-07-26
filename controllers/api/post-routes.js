const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const {withAuth} = require('../../utils/auth');
const fs = require('fs');
const path = require('path');

// Get all posts
router.get('/', (req, res) => {
  Post.findAll({
    order: [['created_at', 'DESC']],
    include: [
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
          include: {
              model: User,
              attributes: ['username']
          },
      },
      {
        model: User,
        attributes: ["username"],
      },
    ]
  })
  .then((dbPostData) => res.json(dbPostData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Get a single post
router.get("/:id", (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id,
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
        attributes: ["username"],
      },
    ],
  })
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404), json({ message: "No post found with this id" });
        return;
      }
      res.json(dbPostData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// // Create a post
// router.post("/", withAuth, (req, res) => {
//   Post.create({
//     title: req.body.title,
//     content: req.body.content,
//     user_id: req.session.user_id,
//   })
//     .then((dbPostData) => res.json(dbPostData))
//     .catch((err) => {
//       console.log(err);
//       res.status(500).json(err);
//     });
// });

// FeatureImage Post
router.post('/', withAuth, (req, res) => {

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  let fileName = req.files.feature;
  let uploadPath = path.join(__dirname, '../../public/assets/uploads/') + fileName.name.replace(/\s+/g, '-').toLowerCase()

  // Use the mv() method to place the file
  fileName.mv(uploadPath, function(err) {
    if (err)
      return res.status(500).send(err);

    console.log('success');  
  });

  // Create the database instance
  Post.create({
    title: req.body.title,
    content: req.body.content,
    user_id: req.session.user_id,
    image_url: '/assets/uploads/' + fileName.name.replace(/\s+/g, '-').toLowerCase()
  })
    .then((dbPostData) => res.json(dbPostData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Update a post
router.put("/:id", withAuth, (req, res) => {
  Post.update(
    {
      title: req.body.title,
      content: req.body.content
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then((dbPostData) => {
      if (!dbPostData) {
        res
          .json(404)
          .res.json({ message: "Post not found, please check the ID" });
        return;
      }
      res.json(dbPostData);
    })
    .catch((err) => {
      console.log(err);
      req.status(500).json(err);
    });
});

// delete a post
router.delete("/:id", withAuth, (req, res) => {
  Post.findOne({
    where: {
      id : req.params.id
    }
  })
  .then(dbDeletePostData => {
    image_url = dbDeletePostData.image_url;
    // delete teh file
    const filePath = path.join(__dirname, '../../public') + image_url;
    if(fileInput) {
      fs.unlink(filePath, function (err) {
        if (err) throw err;
        // if no error, file has been deleted successfully
        console.log('File deleted!');
      });
    }
  })
  .then(result => {
    Post.destroy({
      where: {
        id: req.params.id,
      },
    })
      .then((dbPostData) => {
        if (!dbPostData) {
          res.status(404).res.json({ message: "No post dound with this id" });
          return;
        }
        res.json(dbPostData);
      })
  })
  .catch((err) => {
    console.log(err);
    res.status(500).res.json(err);
  });
});

module.exports = router;
