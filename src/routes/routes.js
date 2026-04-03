import express from 'express';

import {
    showOrganizationDetailsPage,
    showOrganizationsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    organizationValidation,
    showEditOrganizationForm,
    processEditOrganizationForm,
    requireRole
} from '../controllers/organizations.js';

import {
    showProjectsPage,
    showHomePage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    projectValidation,
    showEditProjectForm,
    processEditProjectForm
} from '../controllers/projects.js';

import {
    showCategoryDetailsPage,
    showCategoriesPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    showNewCategoryForm,
    categoryValidation,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm
} from '../controllers/categories.js';

import {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    showDashboard
} from '../controllers/users.js';

const router = express.Router();

// Home
router.get('/', showHomePage);

// Projects
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);

router.get('/new-project', requireLogin, showNewProjectForm);
router.post('/new-project', requireLogin, projectValidation, processNewProjectForm);

router.get('/edit-project/:id', requireLogin, showEditProjectForm);
router.post('/edit-project/:id', requireLogin, projectValidation, processEditProjectForm);

// Organizations
router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);

// Admin only
router.get('/new-organization', requireRole('admin'), showNewOrganizationForm);
router.post(
    '/new-organization',
    requireRole('admin'),
    organizationValidation,
    processNewOrganizationForm
);

router.get('/edit-organization/:id', requireRole('admin'), showEditOrganizationForm);
router.post(
    '/edit-organization/:id',
    requireRole('admin'),
    organizationValidation,
    processEditOrganizationForm
);

// Categories
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);

router.get('/new-category', requireLogin, showNewCategoryForm);
router.post('/new-category', requireLogin, categoryValidation, processNewCategoryForm);

router.get('/edit-category/:id', requireRole('admin'), showEditCategoryForm);
router.post('/edit-category/:id', requireRole('admin'), categoryValidation, processEditCategoryForm);

// Assign categories
router.get('/assign-categories/:projectId', requireLogin, showAssignCategoriesForm);
router.post('/assign-categories/:projectId', requireLogin, processAssignCategoriesForm);

// Auth
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);

router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);

// Dashboard
router.get('/dashboard', requireLogin, showDashboard);

export default router;