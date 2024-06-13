const express = require('express');
const User = require('../models/User')
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/getuser')

const JWT_SECRET = 'newtonslawofmotion';



// ROUTE
// create user using Post: "/api/auth/newuser", doesn't require login
router.post('/newuser', [
  body('username', 'username not valid').isLength({ min: 3 }),
  body('email', 'email not valid').isEmail(),
  body('password', 'password must be minimum 8 characters with number, Lowercase and Uppercase letter').isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1
  })
], async (req, res) => {
  const errors = validationResult(req);

  // executed when validation throws an error 

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // executed when validation doesn't throws error

  const { username, email, password } = req.body;

  try {
    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ errors: [{ msg: 'Email already in use' }] });
    }

    const salt = await bcrypt.genSaltSync(10);
    const hashed_pass = await bcrypt.hash(req.body.password, salt);

    // Create the user
    user = new User({
      username,
      email,
      password: hashed_pass
    });
    await user.save();

    const data = {
      user: {
        id: user.id
      }
    }

    const authtoken = jwt.sign(data, JWT_SECRET);
    res.json(authtoken);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server error');
  }
});


// ROUTE 
// authenticate user using: POST, "api/auth/verifyuser" , doesn't require login
router.post('/login', [
  body('email', 'email not valid').isEmail(),
  body('password', 'password cannot be blank').exists()
], async (req, res) => {
  const errors = validationResult(req);

  // executed when validation throws an error 

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {

    // if email is invalid or doesn't exists
    let user = await User.findOne({ "email": email });
    if (!user) {
      return res.status(400).json({ error: "information invalid" });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);

    // if password doesn't match 
    if (!passwordCompare) {
      return res.status(400).json({ error: "information invalid" });
    }

    const data = {
      user: {
        id: user.id
      }
    }

    const authtoken = jwt.sign(data, JWT_SECRET);
    res.json(authtoken);

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server error');
  }

})


// ROUTE 
// get user details using: POST , "/api/auth/getuser", login required 
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    return res.send(user);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send('Internal Server Error');
  }
})

module.exports = router