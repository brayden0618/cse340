import db from '../models/db.js';
import bcrypt from 'bcrypt';
import { createUser, authenticateUser } from '../models/users.js';
import { getUserVolunteerProjects } from '../models/volunteers.js';

// Registration
const showUserRegistrationForm = (req, res) => {
    res.render('register', { title: 'Register' });
};

const processUserRegistrationForm = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        await createUser(name, email, passwordHash, 'user');

        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/login');
    } catch (error) {
        console.error('Registration error:', error.message);
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

        console.log(req.session.user);

        req.flash('success', 'Logged in successfully.');
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Login error:', error.message);
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
const showDashboard = async (req, res) => {
    const userId = req.session.user.user_id;

    const projects = await getUserVolunteerProjects(userId);

    res.render('dashboard', {
        title: 'Dashboard',
        role: req.session.user.role,
        user: req.session.user,
        projects
    });
};

// Logout
const processLogout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
};

// Users page
const showUsersPage = async (req, res) => {
    try {
        const result = await db.query(
            `SELECT u.user_id, u.name, u.email, r.role_name
             FROM users u
             JOIN roles r ON u.role_id = r.role_id
             ORDER BY u.name`
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