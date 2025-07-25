const { Router } = require('express');
const userController = require('../controllers/userController');
const userRouter = Router();

userRouter.get('/', userController.indexGet);
userRouter.get('/register', userController.registerGet);
userRouter.post('/register', userController.registerPost);
userRouter.get('/success', userController.successGet);
userRouter.get('/login', userController.loginGet);
userRouter.post('/login', userController.loginPost);
userRouter.get('/logout', userController.logoutGet);

module.exports = userRouter;