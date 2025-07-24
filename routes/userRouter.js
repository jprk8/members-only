const { Router } = require('express');
const userController = require('../controllers/userController');
const userRouter = Router();

userRouter.get('/', userController.indexGet);
userRouter.get('/register', userController.registerGet);
userRouter.post('/register', userController.registerPost);
userRouter.get('/success', userController.successGet);

module.exports = userRouter;