import { showOrganizationDetailsPage } from './organizations.js';
import { showProjectsPage, showHomePage } from './projects.js';
import express from 'express';

const router = express.Router();
// Route for projects page
router.get('/projects', showProjectsPage);

// Route for home page
router.get('/', showHomePage);

// Route for project details page
router.get('/project/:id', showProjectDetailsPage);

// Route for organization details page
router.get('/organization/:id', showOrganizationDetailsPage);