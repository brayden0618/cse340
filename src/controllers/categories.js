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

const categoryValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Category name is required')
];

// Show all categories page
const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();

    res.render('categories', {
        title: 'Categories',
        categories
    });
};

// Show category details page
const showCategoryDetailsPage = async (req, res) => {
    const categoryId = req.params.id;

    const category = await getCategoryById(categoryId);

    if (!category) {
        return res.status(404).render('errors/404', {
            title: 'Category Not Found'
        });
    }

    const projects = await getProjectsByCategoryId(categoryId);

    res.render('category', {
        title: category.name,
        category,
        projects
    });
};

// Show assign categories form
const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;

    const projectDetails = await getProjectDetails(projectId);
    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByProjectId(projectId);

    if (!projectDetails || projectDetails.length === 0) {
        return res.status(404).render('errors/404', {
            title: 'Project Not Found'
        });
    }

    res.render('assign-categories', {
        title: 'Assign Categories to Project',
        projectId,
        projectDetails: projectDetails[0],
        categories,
        assignedCategories
    });
};

// Process assign categories form
const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const selectedCategoryIds = req.body.categoryIds || [];

    const categoryIdsArray = Array.isArray(selectedCategoryIds)
        ? selectedCategoryIds
        : [selectedCategoryIds];

    await updateCategoryAssignments(projectId, categoryIdsArray);

    req.flash('success', 'Categories updated successfully.');
    res.redirect(`/project/${projectId}`);
};

// Show new category form
const showNewCategoryForm = (req, res) => {
    res.render('new-category', {
        title: 'New Category',
        errors: []
    });
};

// Process new category form
const processNewCategoryForm = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.render('new-category', {
            title: 'New Category',
            errors: errors.array()
        });
    }

    const { name } = req.body;

    await createCategory(name);

    req.flash('success', 'Category created successfully.');
    res.redirect('/categories');
};

// Show edit category form
const showEditCategoryForm = async (req, res) => {
    const categoryId = req.params.id;
    const category = await getCategoryById(categoryId);

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

// Process edit category form
const processEditCategoryForm = async (req, res) => {
    const categoryId = req.params.id;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.render('edit-category', {
            title: 'Edit Category',
            category: {
                category_id: categoryId,
                name: req.body.name
            },
            errors: errors.array()
        });
    }

    const { name } = req.body;

    await updateCategory(categoryId, name);

    req.flash('success', 'Category updated successfully.');
    res.redirect(`/category/${categoryId}`);
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