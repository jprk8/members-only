const pool = require('./pool');

async function findUserByUsername(username) {
    try {
        const SQL = `
        SELECT * FROM users WHERE username = $1;
        `;
        const { rows } = await pool.query(SQL, [username]);
        return rows[0] || null;
    } catch (err) {
        console.error('Error finding by username:', err);
        throw err;
    }
}

async function findUserById(id) {
    try {
        const SQL = `
        SELECT * FROM users WHERE id = $1;
        `;
        const { rows } = await pool.query(SQL, [id]);
        return rows[0] || null;
    } catch (err) {
        console.error('Error finding by ID', err);
        throw err;
    }
}

async function addUser(user, hashedPassword, membership) {
    try {
        const SQL = `
        INSERT INTO users (username, password, first_name, last_name, membership)
        VALUES ($1, $2, $3, $4, $5);
        `;
        await pool.query(SQL, [user.username, hashedPassword, user.firstName, user.lastName, membership]);
    } catch (err) {
        console.error('Error creating user:', err);
        throw err;
    }
}

async function getPosts() {
    try {
        const SQL = `
        SELECT 
            posts.id,
            posts.title,
            posts.content,
            TO_CHAR(posts.created, 'YYYY/MM/DD HH24:MI') AS created,
            users.username,
            users.first_name || ' ' || users.last_name AS full_name
        FROM posts
        LEFT JOIN users ON posts.user_id = users.id
        ORDER BY posts.created DESC;
        `;
        const { rows } = await pool.query(SQL);
        return rows;
    } catch (err) {
        console.error('Error fetching posts:', err);
        return [];
    }
}

async function createPost(post, user_id) {
    try {
        const SQL = `
        INSERT INTO posts (title, content, user_id)
        VALUES ($1, $2, $3);
        `;
        await pool.query(SQL, [post.title, post.content, user_id]);
    } catch (err) {
        console.error('Error creating post:', err);
        throw err;
    }
}

async function getPostDetails(id) {
    try {
        const SQL = `
        SELECT 
            posts.id,
            posts.title,
            posts.content,
            TO_CHAR(posts.created, 'YYYY/MM/DD HH24:MI') AS created,
            users.username,
            users.first_name || ' ' || users.last_name AS full_name
        FROM posts
        LEFT JOIN users ON posts.user_id = users.id
        WHERE posts.id = $1;
        `;
        const { rows } = await pool.query(SQL, [id]);
        return rows[0];
    } catch (err) {
        console.error('Error fetching post details:', err);
        throw err;
    }
}

async function promoteUser(id) {
    try {
        const SQL = `UPDATE users SET membership = 'super' WHERE id = $1;`;
        await pool.query(SQL, [id]);
    } catch (err) {
        console.error('Error promoting user:', err);
        throw err;
    }
}

async function deletePost(id) {
    try {
        const SQL = `DELETE FROM posts WHERE posts.id = $1;`;
        await pool.query(SQL, [id]);
    } catch (err) {
        console.error('Error deleting post:', err);
        throw err;
    }
}

module.exports = {
    addUser,
    findUserByUsername,
    findUserById,
    getPosts,
    createPost,
    getPostDetails,
    promoteUser,
    deletePost,
}