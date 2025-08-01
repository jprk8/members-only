require('dotenv').config();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const db = require('../db/queries');
const passport = require('passport');

const alphaErr = 'must contain only letters.';
const alphaNumError = 'must contain only letters and numbers.'
const lengthErr = 'must be between 1 and 30 characters.';

const validateUser = [
    body('firstName').trim()
        .isAlpha().withMessage(`First name ${alphaErr}`)
        .isLength({ min: 1, max: 30 }).withMessage(`First name ${lengthErr}`)
        .customSanitizer((name) => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()),
    body('lastName').trim()
        .isAlpha().withMessage(`Last name ${alphaErr}`)
        .isLength({ min: 1, max: 30 }).withMessage(`Last name ${lengthErr}`)
        .customSanitizer((name) => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()),
    body('username').trim()
        .isAlphanumeric().withMessage(`Username ${alphaNumError}`)
        .isLength({ min: 1, max: 30 }).withMessage(`Username ${lengthErr}`)
        .custom(async (value) => {
            const user = await db.findUserByUsername(value);
            if (user) {
                throw new Error('Username is already taken');
            }
            return true;
        }),
    body('confirmPassword')
        .custom((value, { req }) => value === req.body.password)
        .withMessage('Passwords do not match')
]

async function indexGet(req, res) {
    const posts = await db.getPosts();
    res.render('index', { user: req.user, posts: posts });
}

function registerGet(req, res) {
    res.render('register', { title: 'Create User'})
}

async function handleRegisterPost(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).render('register', {
            title: 'Join the Club',
            errors: errors.array(),
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        console.log(req.body.admin);
        const membership = (req.body.admin === 'true') ? 'admin' : 'member';
        await db.addUser(req.body, hashedPassword, membership);
        res.redirect('/success?message=Registration%20Success');
    } catch (err) {
        console.error('Error adding user', err);
        throw err;
    }
}

function successGet(req, res) {
    const message = req.query.message;
    res.render('success', { message: message });
}

function loginGet(req, res) {
    const failed = 'fail' in req.query;
    res.render('login', { title: 'Log In', failed: failed });
}

function loginPost(req, res, next) {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login?fail'
    })(req, res, next);
}

function logoutGet(req, res, next) {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
}

function secretLevelGet(req, res) {
    if (req.isAuthenticated()) {
        res.render('secret-level', { user: req.user });
    } else {
        res.redirect('/login');
    }
}

async function secretLevelPost(req, res) {
    const { password } = req.body;
    if (password === process.env.SECRET_PW) {
        await db.promoteUser(req.user.id);
        req.user.membership = 'super';
        res.redirect('/?message=Promotion Successful!');
    } else {
        res.render('secret-level', { message: 'Incorrect password', user: req.user });
    }
}

module.exports = {
    indexGet,
    registerGet,
    registerPost: [validateUser, handleRegisterPost],
    successGet,
    loginGet,
    loginPost,
    logoutGet,
    secretLevelGet,
    secretLevelPost,
};