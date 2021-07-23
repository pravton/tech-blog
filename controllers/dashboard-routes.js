const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

router.get('/', (req, res) => {
  if(!req.session.loggedIn) {
    res.render('homepage');
  }

  res.render('dashboard', {loggedIn: req.session.loggedIn});
});

module.exports = router;