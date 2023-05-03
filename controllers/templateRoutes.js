const router = require('express').Router();
const { User } = require('../models');
const withAuth = require('../utils/auth');

// TODO: Create a sign in registration route to handle new user registration

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.post('/signup', async (req, res) => {
    try {
        const newUser = await User.create({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: req.body.password,
        });

        req.session.save(() => {
            req.session.user_id = newUser.id;
            req.session.logged_in = true;
            
            //res.status(200).json(newUser);
            res.redirect('/');
            return;
            
        });

    } catch (err) {
        res.status(400).json(err);
    }
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