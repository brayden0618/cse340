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

import {
    volunteerForProject,
    unvolunteerFromProject
} from '../controllers/volunteers.js';

const router = express.Router();

/* =========================
   Home
========================= */
router.get('/', showHomePage);

/* =========================
   Projects
========================= */
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);

// Admin only: create/edit projects
router.get('/new-project', requireLogin, requireRole('admin'), showNewProjectForm);
router.post(
    '/new-project',
    requireLogin,
    requireRole('admin'),
    projectValidation,
    processNewProjectForm
);

router.get('/edit-project/:id', requireLogin, requireRole('admin'), showEditProjectForm);
router.post(
    '/edit-project/:id',
    requireLogin,
    requireRole('admin'),
    projectValidation,
    processEditProjectForm
);

/* =========================
   Organizations (Admin Only for Create/Edit)
========================= */
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

/* =========================
   Categories
========================= */
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);

// Admin only: create/edit categories
router.get('/new-category', requireLogin, requireRole('admin'), showNewCategoryForm);
router.post(
    '/new-category',
    requireLogin,
    requireRole('admin'),
    categoryValidation,
    processNewCategoryForm
);

router.get('/edit-category/:id', requireLogin, requireRole('admin'), showEditCategoryForm);
router.post(
    '/edit-category/:id',
    requireLogin,
    requireRole('admin'),
    categoryValidation,
    processEditCategoryForm
);

// Assign Categories (treated as admin action for safety)
router.get('/assign-categories/:projectId', requireLogin, requireRole('admin'), showAssignCategoriesForm);
router.post(
    '/assign-categories/:projectId',
    requireLogin,
    requireRole('admin'),
    processAssignCategoriesForm
);

/* =========================
   Authentication
========================= */
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);

router.get('/login', showLoginForm);
router.post('/login', processLoginForm);

router.get('/logout', processLogout);

/* =========================
   Dashboard (Login Required)
========================= */
router.get('/dashboard', requireLogin, showDashboard);

/* =========================
   Users Page (Admin Only)
========================= */
router.get('/users', requireLogin, requireRole('admin'), showUsersPage);

/* =========================
   Volunteer Routes (Login Required)
========================= */
router.post('/projects/:id/volunteer', requireLogin, volunteerForProject);
router.post('/projects/:id/unvolunteer', requireLogin, unvolunteerFromProject);

export default router;