import express from 'express';
import { showOrganizationDetailsPage, showOrganizationsPage, showNewOrganizationForm, processNewOrganizationForm, organizationValidation } from '../controllers/organizations.js';
import { showProjectsPage, showHomePage, showProjectDetailsPage } from '../controllers/projects.js';
import { showCategoryDetailsPage, showCategoriesPage } from '../controllers/categories.js';

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

export default router;