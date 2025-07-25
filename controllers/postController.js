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

module.exports = {
    createPostGet,
    createPostPost,
}