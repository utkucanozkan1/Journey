const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
// reg

router.post('/register', async (req, res) => {
  // generate new pass
  const { password, username, email } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  // create new user
  const newUser = new User({
    username,
    email,
    password: hashed,
  });
  // save user and resp
  newUser.save()
    .then((user) => res.status(201).send(user._id))
    .catch((err) => res.status(500).send(err));
});

// login
router.post('/login', async (req, res) => {
  // find user
  User.findOne({ username: req.body.username })
    .then((user) => {
      if (!user) {
        res.status(400).send('Wrong Username or Password');
      } else {
        // validate password
        bcrypt.compare(req.body.password, user.password)
          .then((pass) => {
            if (!pass) {
              res.status(400).send('Wrong Username or Password');
            } else {
              res.status(201).send({ _id: user._id, username: user.username });
            }
          });
      }
    });

  // send success
});

module.exports = router;
