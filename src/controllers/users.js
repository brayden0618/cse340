import bcrypt from 'bcrypt';
import { createUser, authenticateUser } from '../models/users.js';

// Show registration form
const showUserRegistrationForm = (req, res) => {
    res.render('register', { title: 'Register' });
};

// Handle registration
const processUserRegistrationForm = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        await createUser(name, email, passwordHash);

        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/login');
    } catch (error) {
        console.error('Error registering user:', error);
        req.flash('error', 'An error occurred during registration.');
        res.redirect('/register');
    }
};

// Show login form
const showLoginForm = (req, res) => {
    res.render('login', { title: 'Login' });
};

// Handle login
const processLoginForm = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await authenticateUser(email, password);

        if (!user) {
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/login');
        }

        // Store user in session ✅
        req.session.user = user;

        if (process.env.NODE_ENV === 'development') {
            console.log('User logged in:', user);
        }

        req.flash('success', 'Login successful!');
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Error during login:', error);
        req.flash('error', 'An error occurred during login.');
        res.redirect('/login');
    }
};

// Require login middleware
const requireLogin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        req.flash('error', 'You must be logged in to access this page.');
        return res.redirect('/login');
    }
    next();
};

// Logout
const processLogout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
};

// Dashboard
const showDashboard = (req, res) => {
    const user = req.session.user;

    res.render('dashboard', {
        title: 'Dashboard',
        name: user.name,
        email: user.email
    });
};

// Require specific role
const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.session || !req.session.user) {
            req.flash('error', 'You must be logged in first.');
            return res.redirect('/login');
        }

        if (req.session.user.role_name !== role) {
            req.flash('error', 'Access denied.');
            return res.redirect('/');
        }

        next();
    };
};

export {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    requireLogin,
    processLogout,
    showDashboard,
    requireRole
};