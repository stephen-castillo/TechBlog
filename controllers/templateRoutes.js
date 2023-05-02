const router = require('express').Router();
const { User } = require('../models');
const withAuth = require('../utils/auth');

// TODO: Create a sign in registration route to handle new user registration

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.get('/', withAuth, async (req, res) => {
    try {
            // Probably DO NOT want this data being returned
            // TODO: Remove this
            const userData = await User.findAll({
            attributes: { exclude: ['password'] },
            order: [
                ['last_name', 'ASC'], 
                ['first_name', 'ASC']
            ],
        });

    // TODO: Remove this and replace with data that I want on my homepage
    const users = userData.map((project) => project.get({ plain: true }));

    res.render('home', {
      users,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

module.exports = router;