import express from 'express';

import {
    showOrganizationDetailsPage, showOrganizationsPage, showNewOrganizationForm, processNewOrganizationForm,
    organizationValidation, showEditOrganizationForm, processEditOrganizationForm
} from '../controllers/organizations.js';

import {
    showProjectsPage, showHomePage, showProjectDetailsPage, showNewProjectForm, processNewProjectForm,
    projectValidation, showEditProjectForm, processEditProjectForm
} from '../controllers/projects.js';
 
import {
    showCategoryDetailsPage, showCategoriesPage, showAssignCategoriesForm, processAssignCategoriesForm, showNewCategoryForm
    , categoryValidation, processNewCategoryForm, showEditCategoryForm, processEditCategoryForm
} from '../controllers/categories.js';

import { showUserRegistrationForm, processUserRegistrationForm, showLoginForm, processLoginForm, processLogout, requireLogin, showDashboard } from '../controllers/users.js';

const router = express.Router();

// Home
router.get('/', showHomePage);

// Projects list
router.get('/projects', showProjectsPage);

// Project details
router.get('/project/:id', showProjectDetailsPage);

// Organization list
router.get('/organizations', showOrganizationsPage);

// Organization details
router.get('/organization/:id', showOrganizationDetailsPage);

// Category details
router.get('/category/:id', showCategoryDetailsPage);

// Categories list
router.get('/categories', showCategoriesPage);

// Route for new organization page
router.get('/new-organization', showNewOrganizationForm);

// Route to handle new organization form submission
router.post('/new-organization', organizationValidation, processNewOrganizationForm);

// Route to display the edit organization form
router.get('/edit-organization/:id', showEditOrganizationForm);

// Route to handle the edit organization form submission
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm);

// Route for new project page
router.get('/new-project', showNewProjectForm);

// Route to handle new project form submission
router.post('/new-project', projectValidation, processNewProjectForm);

// Routes to handle the assign categories to project form
router.get('/assign-categories/:projectId', showAssignCategoriesForm);
router.post('/assign-categories/:projectId', processAssignCategoriesForm);

// Route to display the edit project form
router.get('/edit-project/:id', showEditProjectForm);

// Route to handle the edit project form submission
router.post('/edit-project/:id', projectValidation, processEditProjectForm);

// Route for new category page
router.get('/new-category', showNewCategoryForm);

// Route to handle new category form submission
router.post('/new-category', categoryValidation, processNewCategoryForm);

// Route to display the edit category form
router.get('/edit-category/:id', showEditCategoryForm);

// Route to handle the edit category form submission
router.post('/edit-category/:id', categoryValidation, processEditCategoryForm);

// user registration routes
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);

// User login routes
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);

// Protected dashboard route
router.get('/dashboard', requireLogin, showDashboard);

export default router;