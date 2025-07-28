const db = require('../db/queries');

function createPostGet(req, res) {
    if (req.isAuthenticated()) {
        res.render('create-post', { title: 'Create New Post', user: req.user});
    } else {
        res.redirect('/login');
    }
}

async function createPostPost(req, res) {
    if (req.isAuthenticated()) {
        await db.createPost(req.body, req.user.id);
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
}

async function detailsGet(req, res) {
    const post = await db.getPostDetails(req.params.id);
    res.render('details', { post: post, user: req.user });
}

async function deletePostPost(req, res) {
    if (req.isAuthenticated() && req.user.membership === 'admin') {
        await db.deletePost(req.params.id);
        res.redirect('/');
    } else {
        req.status(403).send('Access denied');
    }
}

module.exports = {
    createPostGet,
    createPostPost,
    detailsGet,
    deletePostPost,
}