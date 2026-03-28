import {
    getCategoryById,
    getProjectsByCategoryId,
    getAllCategories,
    getCategoriesByProjectId,
    updateCategoryAssignments,
    createCategory,
    updateCategory
} from '../models/categories.js';

import { getProjectDetails } from '../models/projects.js';
import { body, validationResult } from 'express-validator';

// Validation
const categoryValidation = [
    body('name')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Name must be at least 2 characters long')
];

// Show all categories
const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();

    res.render('categories', {
        title: 'Categories',
        categories
    });
};

// Show category details
const showCategoryDetailsPage = async (req, res) => {
    const categoryId = req.params.id;

    const category = await getCategoryById(categoryId);
    if (!category) {
        return res.status(404).render('errors/404', { title: 'Category Not Found' });
    }

    const projects = await getProjectsByCategoryId(categoryId);

    res.render('category', {
        title: category.name,
        category,
        projects
    });
};

// Assign categories form
const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;

    const projectDetails = await getProjectDetails(projectId);
    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByProjectId(projectId);

    res.render('assign-categories', {
        title: 'Assign Categories',
        projectId,
        projectDetails,
        categories,
        assignedCategories
    });
};

// Process assign categories
const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const selected = req.body.categoryIds || [];

    const categoryIds = Array.isArray(selected) ? selected : [selected];

    await updateCategoryAssignments(projectId, categoryIds);

    req.flash('success', 'Categories updated.');
    res.redirect(`/project/${projectId}`);
};

// Show new category form
const showNewCategoryForm = (req, res) => {
    res.render('new-category', {
        title: 'New Category',
        errors: []
    });
};

// Process new category
const processNewCategoryForm = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.render('new-category', {
            title: 'New Category',
            errors: errors.array()
        });
    }

    try {
        await createCategory(req.body.name);

        req.flash('success', 'Category created successfully.');
        res.redirect('/categories');
    } catch (error) {
        console.error(error);

        res.render('new-category', {
            title: 'New Category',
            errors: [{ msg: 'Something went wrong.' }]
        });
    }
};

// Show edit form
const showEditCategoryForm = async (req, res) => {
    const category = await getCategoryById(req.params.id);

    if (!category) {
        return res.status(404).render('errors/404', {
            title: 'Category Not Found'
        });
    }

    res.render('edit-category', {
        title: 'Edit Category',
        category,
        errors: []
    });
};

// Process edit
const processEditCategoryForm = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.render('edit-category', {
            title: 'Edit Category',
            category: {
                category_id: req.params.id,
                name: req.body.name
            },
            errors: errors.array()
        });
    }

    try {
        await updateCategory(req.params.id, req.body.name);

        req.flash('success', 'Category updated successfully.');
        res.redirect(`/category/${req.params.id}`);
    } catch (error) {
        console.error(error);

        res.render('edit-category', {
            title: 'Edit Category',
            category: {
                category_id: req.params.id,
                name: req.body.name
            },
            errors: [{ msg: 'Something went wrong.' }]
        });
    }
};

export {
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    categoryValidation
};