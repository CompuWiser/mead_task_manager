const jwt = require('jsonwebtoken');
const User = require('../models/user_model');

const auth = async function authenticate(req, res, next) {
  try {
    const token = req.header('Authorization').replace('Bearer ', '').trim();
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token
    });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
    
  } catch (e) {
    res.status(401).send({ error: 'Authentication Failed.' });
  }
};

module.exports = auth;