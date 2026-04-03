import {
    getAllOrganizations,
    getOrganizationDetails,
    createOrganization,
    updateOrganization
} from '../models/organizations.js';

import { getProjectsByOrganizationId } from '../models/projects.js';
import { body, validationResult } from 'express-validator';

// Validation Rules
const organizationValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Organization name is required')
        .isLength({ min: 3, max: 150 })
        .withMessage('Organization name must be between 3 and 150 characters'),

    body('description')
        .trim()
        .notEmpty()
        .withMessage('Organization description is required')
        .isLength({ max: 500 })
        .withMessage('Organization description cannot exceed 500 characters'),

    body('contactEmail')
        .normalizeEmail()
        .notEmpty()
        .withMessage('Contact email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
];

// Create Organization
const processNewOrganizationForm = async (req, res) => {
    const results = validationResult(req);

    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect('/new-organization');
    }

    const { name, description, contactEmail } = req.body;
    const logoFilename = 'placeholder-logo.png';

    try {
        const organizationId = await createOrganization(
            name,
            description,
            contactEmail,
            logoFilename
        );

        res.redirect(`/organization/${organizationId}`);
    } catch (error) {
        console.error(error);
        req.flash('error', 'Error creating organization');
        res.redirect('/new-organization');
    }
};

// List Organizations
const showOrganizationsPage = async (req, res) => {
    try {
        const organizations = await getAllOrganizations();

        res.render('organizations', {
            title: 'Organizations',
            organizations
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

// Organization Details
const showOrganizationDetailsPage = async (req, res) => {
    const organizationId = req.params.id;

    try {
        const organizationDetails = await getOrganizationDetails(organizationId);

        if (!organizationDetails) {
            return res.status(404).render('errors/404', {
                title: 'Organization Not Found'
            });
        }

        const projects = await getProjectsByOrganizationId(organizationId);

        res.render('organization', {
            title: organizationDetails.name,
            organizationDetails,
            projects
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

// Show New Form
const showNewOrganizationForm = (req, res) => {
    res.render('new-organization', {
        title: 'Add New Organization'
    });
};

// Show Edit Form
const showEditOrganizationForm = async (req, res) => {
    const organizationId = req.params.id;

    try {
        const organizationDetails = await getOrganizationDetails(organizationId);

        res.render('edit-organization', {
            title: 'Edit Organization',
            organizationDetails
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

// Process Edit Form
const processEditOrganizationForm = async (req, res) => {
    const organizationId = req.params.id;

    const results = validationResult(req);

    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect(`/edit-organization/${organizationId}`);
    }

    const { name, description, contactEmail, logoFilename } = req.body;

    try {
        await updateOrganization(
            organizationId,
            name,
            description,
            contactEmail,
            logoFilename
        );

        req.flash('success', 'Organization updated successfully!');
        res.redirect(`/organization/${organizationId}`);
    } catch (error) {
        console.error(error);
        req.flash('error', 'Error updating organization');
        res.redirect(`/edit-organization/${organizationId}`);
    }
};

const requireRole = (role) => {
    return (req, res, next) => {
        // Make sure user is logged in
        if (!req.session || !req.session.user) {
            req.flash('error', 'Please log in first');
            return res.redirect('/login');
        }

        // Check role
        if (req.session.user.role !== role) {
            req.flash('error', 'Access denied');
            return res.redirect('/');
        }

        next();
    };
};

// Exports
export {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    organizationValidation,
    showEditOrganizationForm,
    processEditOrganizationForm,
    requireRole
};