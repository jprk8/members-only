function indexGet(req, res) {
    res.render('index', { title: 'Secret Club' });
}

module.exports = {
    indexGet
};