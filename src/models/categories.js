import db from './db.js';

// Get a single category by ID
const getCategoryById = async (categoryId) => {
    const query = `
        SELECT
            category_id,
            name
        FROM category
        WHERE category_id = $1;
    `;

    const result = await db.query(query, [categoryId]);

    return result.rows.length > 0 ? result.rows[0] : null;
};


// Get all categories for a specific project
const getCategoriesByProjectId = async (projectId) => {
    const query = `
        SELECT
            c.category_id,
            c.name
        FROM category c
        JOIN project_category pc
            ON c.category_id = pc.category_id
        WHERE pc.project_id = $1;
    `;

    const result = await db.query(query, [projectId]);

    return result.rows;
};

// Get all categories
const getAllCategories = async () => {
    const query = `
        SELECT
            category_id,
            name
        FROM category
        ORDER BY name;
    `;
    const result = await db.query(query);
    return result.rows;
};


// Get all projects for a specific category
const getProjectsByCategoryId = async (categoryId) => {
    const query = `
    SELECT
        p.project_id,
        p.title,
        p.location,
        p.project_date
    FROM projects p
    JOIN project_category pc
        ON p.project_id = pc.project_id
    WHERE pc.category_id = $1
    ORDER BY p.project_date;
`;

    const result = await db.query(query, [categoryId]);

    return result.rows;
};

const assignCategoryToProject = async(categoryId, projectId) => {
    const query = `
        INSERT INTO project_category (category_id, project_id)
        VALUES ($1, $2);
    `;

    await db.query(query, [categoryId, projectId]);
}

const updateCategoryAssignments = async(projectId, categoryIds) => {
    // First, remove existing category assignments for the project
    const deleteQuery = `
        DELETE FROM project_category
        WHERE project_id = $1;
    `;
    await db.query(deleteQuery, [projectId]);

    // Next, add the new category assignments
    for (const categoryId of categoryIds) {
        await assignCategoryToProject(categoryId, projectId);
    }
}

// Export all model functions
export {
    getCategoryById,
    getCategoriesByProjectId,
    getProjectsByCategoryId,
    getAllCategories,
    assignCategoryToProject,
    updateCategoryAssignments
}; 