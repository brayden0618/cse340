import db from './db.js';

// Get a single category by ID
const getCategoryById = async (categoryId) => {
    const query = `
        SELECT category_id, name
        FROM category
        WHERE category_id = $1;
    `;
    const result = await db.query(query, [categoryId]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

// Get all categories
const getAllCategories = async () => {
    const query = `
        SELECT category_id, name
        FROM category
        ORDER BY name;
    `;
    const result = await db.query(query);
    return result.rows;
};

// Get categories for a project
const getCategoriesByProjectId = async (projectId) => {
    const query = `
        SELECT c.category_id, c.name
        FROM category c
        JOIN project_category pc ON c.category_id = pc.category_id
        WHERE pc.project_id = $1;
    `;
    const result = await db.query(query, [projectId]);
    return result.rows;
};

// Get projects by category
const getProjectsByCategoryId = async (categoryId) => {
    const query = `
        SELECT p.project_id, p.title, p.location, p.project_date
        FROM projects p
        JOIN project_category pc ON p.project_id = pc.project_id
        WHERE pc.category_id = $1
        ORDER BY p.project_date;
    `;
    const result = await db.query(query, [categoryId]);
    return result.rows;
};

// Assign category to project
const assignCategoryToProject = async (categoryId, projectId) => {
    const query = `
        INSERT INTO project_category (category_id, project_id)
        VALUES ($1, $2);
    `;
    await db.query(query, [categoryId, projectId]);
};

// Update category assignments
const updateCategoryAssignments = async (projectId, categoryIds) => {
    await db.query(`DELETE FROM project_category WHERE project_id = $1;`, [projectId]);

    for (const categoryId of categoryIds) {
        await assignCategoryToProject(categoryId, projectId);
    }
};

// Create category
const createCategory = async (name) => {
    const result = await db.query(
        `INSERT INTO category (name) VALUES ($1) RETURNING category_id;`,
        [name]
    );

    if (result.rows.length === 0) {
        throw new Error('Failed to create category');
    }

    return result.rows[0].category_id;
};

// Update category
const updateCategory = async (categoryId, name) => {
    const result = await db.query(
        `UPDATE category SET name = $1 WHERE category_id = $2 RETURNING category_id;`,
        [name, categoryId]
    );

    if (result.rows.length === 0) {
        throw new Error('Failed to update category');
    }

    return result.rows[0].category_id;
};

export {
    getCategoryById,
    getAllCategories,
    getCategoriesByProjectId,
    getProjectsByCategoryId,
    assignCategoryToProject,
    updateCategoryAssignments,
    createCategory,
    updateCategory
};