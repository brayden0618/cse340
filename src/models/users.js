import bcrypt from 'bcrypt';
import db from './db.js';

// Create user
const createUser = async (name, email, passwordHash) => {
    const result = await db.query(
        `INSERT INTO users (name, email, password_hash, role)
         VALUES ($1, $2, $3, 'user')
         RETURNING user_id, name, email, role`,
        [name, email, passwordHash]
    );

    return result.rows[0];
};

// Authenticate user
const authenticateUser = async (email, password) => {
    const result = await db.query(
        `SELECT user_id, name, email, password_hash, role_id
         FROM users
         WHERE email = $1`,
        [email]
    );

    if (result.rows.length === 0) return null;

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return null;

    return {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role
    };
};

export { createUser, authenticateUser };