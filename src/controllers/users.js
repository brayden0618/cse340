import bcrypt from 'bcrypt';
import { createUser, authenticateUser } from '../models/users.js';

// Registration
const showUserRegistrationForm = (req, res) => {
    res.render('register', { title: 'Register' });
};

const processUserRegistrationForm = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        await createUser(name, email, passwordHash);

        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/login');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Registration failed.');
        res.redirect('/register');
    }
};

// Login
const showLoginForm = (req, res) => {
    res.render('login', { title: 'Login' });
};

const processLoginForm = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await authenticateUser(email, password);

        if (!user) {
            req.flash('error', 'Invalid credentials.');
            return res.redirect('/login');
        }

        req.session.user = user;

        req.flash('success', 'Logged in successfully.');
        res.redirect('/dashboard');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Login error.');
        res.redirect('/login');
    }
};

// Middleware: require login
const requireLogin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        req.flash('error', 'Please log in first.');
        return res.redirect('/login');
    }
    next();
};

// Middleware: require role
const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.session || !req.session.user) {
            req.flash('error', 'Please log in first.');
            return res.redirect('/login');
        }

        if (req.session.user.role !== role) {
            req.flash('error', 'Access denied.');
            return res.redirect('/dashboard');
        }

        next();
    };
};

// Dashboard
const showDashboard = (req, res) => {
    const user = req.session.user;

    res.render('dashboard', {
        title: 'Dashboard',
        name: user.name,
        email: user.email,
        role: user.role
    });
};

// Logout
const processLogout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
};

// USERS PAGE (ADMIN ONLY)
const showUsersPage = async (req, res) => {
    try {
        const result = await db.query(
            `SELECT user_id, name, email, role
             FROM users
             ORDER BY name`
        );

        res.render('users', {
            title: 'Users',
            users: result.rows
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

export {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    requireLogin,
    requireRole,
    processLogout,
    showDashboard,
    showUsersPage
};