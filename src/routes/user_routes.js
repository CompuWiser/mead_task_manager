const router = require('express').Router();
const userController = require('../controllers/user_controller');
const auth = require('../middleware/auth');

router.get('/users/:id/avatar', userController.getAvatar);
router.post('/users', userController.signup);
router.post('/users/login', userController.login);

// All routes below will need to authenticate
router.use(auth);
router.post('/users/logout', userController.logout);
router.post('/users/logoutAll', userController.logoutAll);
router.get('/users/me', userController.showMyProfile);
router.patch('/users/me', userController.editMyInfo);
router.delete('/users/me', userController.deleteMyAccount);
router.delete('/users/me/avatar', userController.deleteAvatar);

router.post(
  '/users/me/avatar',
  userController.uploadImages,
  userController.addAvatarImage,
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

module.exports = router;
