import bcrypt from 'bcrypt';
import db from './db.js';

// Create user
const createUser = async (name, email, passwordHash, role = 'user') => {
    // Look up the numeric role_id from the roles table
    const roleResult = await db.query(
        `SELECT role_id
         FROM roles
         WHERE role_name = $1`,
        [role]
    );

    if (roleResult.rows.length === 0) {
        throw new Error(`Role "${role}" not found.`);
    }

    const roleId = roleResult.rows[0].role_id;

    const result = await db.query(
        `INSERT INTO users (name, email, password_hash, role_id)
         VALUES ($1, $2, $3, $4)
         RETURNING user_id, name, email, role_id`,
        [name, email, passwordHash, roleId]
    );

    return result.rows[0];
};

// Authenticate user
const authenticateUser = async (email, password) => {
    const result = await db.query(
        `SELECT u.user_id, u.name, u.email, u.password_hash, r.role_name
         FROM users u
         JOIN roles r ON u.role_id = r.role_id
         WHERE u.email = $1`,
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
        role: user.role_name
    };
};

export { createUser, authenticateUser };