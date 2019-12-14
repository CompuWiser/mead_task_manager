const sharp = require('sharp');
const multer = require('multer');
const User = require('../models/user_model');
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account')

exports.getAvatar = async function (req, res) {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) {
      throw new Error();
    }

    res.set('Content-Type', 'image/png');
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send();
  }
};

exports.signup = async function signup(req, res) {
  const user = new User(req.body);

  try {
    await user.save();
    sendWelcomeEmail(user.email, user.name);
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
};

exports.login = async function login(req, res) {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send();
  }
};

exports.logout = async function logMeOut(req, res) {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send();
  }
};

exports.logoutAll = async function logoutAll(req, res) {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
};

exports.showMyProfile = async function showMyProfile(req, res) {
  res.send(req.user);
};

exports.editMyInfo = async function editMyInfo(req, res) {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    updates.forEach((update) => {
      req.user[update] = req.body[update];
    });

    await req.user.save();
    res.send(req.user);

  } catch (e) {
    res.status(400).send(e);
  }
};

exports.deleteMyAccount = async function deleteMyAccount( req, res ) {
  try {
    await req.user.remove();
    sendCancelationEmail(req.user.email, req.user.name);
    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
};

const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/png', 'image/jpg', 'image/jpeg'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Please upload an image'));
  }
};

exports.uploadImages = multer({
  limits: { fileSize: 1000000 },
  fileFilter
}).single('avatar');

exports.addAvatarImage = async function addAvatarImage(req, res) {
  const imageBuffer = await sharp(req.file.buffer)
    .resize({ width: 250, height: 250 })
    .png()
    .toBuffer();
  req.user.avatar = imageBuffer;
  await req.user.save();
  res.send();
};

exports.deleteAvatar = async function deleteAvatar(req, res) {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
};