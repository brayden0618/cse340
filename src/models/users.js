import bcrypt from 'bcrypt';
import db from './db.js';

// Create a new user
const createUser = async (name, email, passwordHash) => {
    const query = `
        INSERT INTO users (name, email, password_hash, role_id)
        VALUES ($1, $2, $3, (
            SELECT role_id FROM roles WHERE role_name = 'user'
        ))
        RETURNING user_id;
    `;

    const query_params = [name, email, passwordHash];
    const result = await db.query(query, query_params);

    if (result.rows.length === 0) {
        throw new Error('Failed to create user');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new user with ID:', result.rows[0].user_id);
    }

    return result.rows[0].user_id;
};

// Find user by email
const findUserByEmail = async (email) => {
    const query = `
        SELECT 
            u.user_id,
            u.name,
            u.email,
            u.password_hash,
            r.role_name
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        WHERE u.email = $1
    `;

    const result = await db.query(query, [email]);

    if (result.rows.length === 0) {
        return null;
    }

    return result.rows[0];
};

// Verify password
const verifyPassword = async (password, passwordHash) => {
    return bcrypt.compare(password, passwordHash);
};

// Authenticate user
const authenticateUser = async (email, password) => {
    const user = await findUserByEmail(email);

    if (!user) {
        return null;
    }

    const isMatch = await verifyPassword(password, user.password_hash);

    if (!isMatch) {
        return null;
    }

    return user;
};

export { createUser, findUserByEmail, verifyPassword, authenticateUser };