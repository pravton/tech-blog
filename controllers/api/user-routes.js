const router = require('express').Router();
const { User, Post, Comment } = require('../../models');


// Get all users
router.get('/', (req, res) => {
  User.findAll({
    attributes: {exclude: ['password']}
  })
  .then(dbUserData => res.json(dbUserData))
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  })
});

// Get only one user
router.get('/:id', (req, res) => {
  User.findOne({
    attributes: {exclude: ['password']},
    where: {
      id: req.params.id
    },
    include: [
      {
        model: Post,
        // attributes: ['id', 'comment_text', 'created_at']
      },
      {
        model: Comment,
        // attributes: ['id', 'comment_text', 'created_at'],
        include: {
          model: Post,
          attributes: ['title']
        }
      }
    ]
  })
  .then(dbUserData => {
    if(!dbUserData) {
      res.sendStatus(404).json({ message: 'User not found! Please check the id'});
      return;
    }
    res.json(dbUserData);
  }).catch(err => {
    console.log(err);
    res.status(500).json(err);
  })
});

// Post a user
router.post('/', (req, res) => {
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  })
  .then(dbUserData => {
    req.session.save(() => {
      req.session.user_id = dbUserData.id;
      req.session.username = dbUserData.username;
      req.session.loggedin = true;

    console.log(req.session);  
    res.json(dbUserData);
    });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

// Update a user
router.put('/:id', (req, res) => {
  User.update({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  }, 
  {
    individualHooks: true,
    where: {
      id: req.params.id
    }  
  })
  .then(dbUserData => {
    if(!dbUserData) {
      res.sendStatus(404).json({ message: 'User not found! Please check the id'})
      return;
    }
    res.json(dbUserData);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

// Delete a user
router.delete('/:id', (req, res) => {
  User.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(dbUserData => {
    if(!dbUserData) {
      res.sendStatus(404).json({ message: 'User not found! Please check the id'});
      return;
    }
    res.json(dbUserData);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

// User login
router.post('/login', (req, res) => {
  // {email: 'user@email.com', password: 'password' }
  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(dbUserData => {
    if(!dbUserData) {
      res.status(400).json({message: 'No user with that email address!'})
      return;
    }
    
    //authenticate the user
    const validPassword = dbUserData.checkPassword(req.body.password);
    if(!validPassword) {
      res.status(400).json({ message: 'Incorrect password!' });
      return;
    }

    req.session.save(() => {
      // declare session variables
      req.session.user_id = dbUserData.id;
      req.session.username = dbUserData.username;
      req.session.loggedIn = true;
      // send response
      res.json({ user: dbUserData, message: 'You are now logged in!' });
    });
  });
});

// Logout route
router.post('/logout', (req, res) => {
  if(req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(400).end();
  }
});

module.exports = router;