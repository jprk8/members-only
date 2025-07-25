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

async function addUser(user, hashedPassword) {
    try {
        const SQL = `
            INSERT INTO users (username, password, first_name, last_name, membership)
            VALUES ($1, $2, $3, $4, $5);
        `;
        await pool.query(SQL, [user.username, hashedPassword, user.firstName, user.lastName, 'member']);
    } catch (err) {
        console.error('Error creating user:', err);
        throw err;
    }
}

module.exports = {
    addUser,
    findUserByUsername,
    findUserById,
}