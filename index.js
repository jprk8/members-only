require('dotenv').config();
const path = require('node:path');
const express = require('express');
const userRouter = require('./routes/userRouter');
const postRouter = require('./routes/postRouter');
const session = require('express-session');
const passport = require('./config/passport');

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', userRouter);
app.use('/posts', postRouter);

const PORT = parseInt(process.env.PORT) || 3000;
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}...`));