import express from 'express';

import {
    showOrganizationDetailsPage,
    showOrganizationsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    organizationValidation,
    showEditOrganizationForm,
    processEditOrganizationForm
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
    requireLogin,
    requireRole,
    processLogout,
    showDashboard,
    showUsersPage
} from '../controllers/users.js';

const router = express.Router();

/* Home */
router.get('/', showHomePage);

/* Projects */
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);

router.get('/new-project', requireLogin, showNewProjectForm);
router.post('/new-project', requireLogin, projectValidation, processNewProjectForm);

router.get('/edit-project/:id', requireLogin, showEditProjectForm);
router.post('/edit-project/:id', requireLogin, projectValidation, processEditProjectForm);

/* Organizations (Admin Only) */
router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);

router.get('/new-organization', requireLogin, requireRole('admin'), showNewOrganizationForm);
router.post(
    '/new-organization',
    requireLogin,
    requireRole('admin'),
    organizationValidation,
    processNewOrganizationForm
);

router.get('/edit-organization/:id', requireLogin, requireRole('admin'), showEditOrganizationForm);
router.post(
    '/edit-organization/:id',
    requireLogin,
    requireRole('admin'),
    organizationValidation,
    processEditOrganizationForm
);

/* Categories */
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);

router.get('/new-category', requireLogin, showNewCategoryForm);
router.post('/new-category', requireLogin, categoryValidation, processNewCategoryForm);

router.get('/edit-category/:id', requireLogin, requireRole('admin'), showEditCategoryForm);
router.post('/edit-category/:id', requireLogin, requireRole('admin'), categoryValidation, processEditCategoryForm);

/* Assign Categories */
router.get('/assign-categories/:projectId', requireLogin, showAssignCategoriesForm);
router.post('/assign-categories/:projectId', requireLogin, processAssignCategoriesForm);

// Auth
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);

router.get('/login', showLoginForm);
router.post('/login', processLoginForm);

router.get('/logout', processLogout);

// Dashboard (requires login)
router.get('/dashboard', requireLogin, showDashboard);

// USERS PAGE (ADMIN ONLY)
router.get('/users', requireLogin, requireRole('admin'), showUsersPage);

export default router;