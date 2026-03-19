import express from 'express';
import { showOrganizationDetailsPage, showOrganizationsPage } from './organizations.js';
import { showProjectsPage, showHomePage, showProjectDetailsPage } from './projects.js';

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

export default router;