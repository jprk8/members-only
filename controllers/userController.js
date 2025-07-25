const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const db = require('../db/queries');
const passport = require('passport');

const alphaErr = 'must contain only numbers.';
const alphaNumError = 'must contain only letters and numbers.'
const lengthErr = 'must be between 1 and 30 characters.';

const validateUser = [
    body('firstName').trim()
        .isAlpha().withMessage(`First name ${alphaErr}`)
        .isLength({ min: 1, max: 30 }).withMessage(`First name ${lengthErr}`)
        .customSanitizer(name => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()),
    body('lastName').trim()
        .isAlpha().withMessage(`Last name ${alphaErr}`)
        .isLength({ min: 1, max: 30 }).withMessage(`Last name ${lengthErr}`)
        .customSanitizer(name => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()),
    body('username').trim()
        .isAlphanumeric().withMessage(`Username ${alphaNumError}`)
        .isLength({ min: 1, max: 30 }).withMessage(`Username ${lengthErr}`)
        .custom(async value => {
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

function indexGet(req, res) {
    res.render('index', { user: req.user });
}

function registerGet(req, res) {
    res.render('register', { title: 'Join the Club'})
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
        await db.addUser(req.body, hashedPassword);
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
    res.render('login', { title: 'Log In' });
}

function loginPost(req, res, next) {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login'
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

module.exports = {
    indexGet,
    registerGet,
    registerPost: [validateUser, handleRegisterPost],
    successGet,
    loginGet,
    loginPost,
    logoutGet,
};