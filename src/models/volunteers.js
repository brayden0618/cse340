import db from '../models/db.js';

// Add volunteer
export const addVolunteer = async (userId, projectId) => {
    const query = `
        INSERT INTO volunteers (user_id, project_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
    `;
    return db.query(query, [userId, projectId]);
};

// Remove volunteer
export const removeVolunteer = async (userId, projectId) => {
    const query = `
        DELETE FROM volunteers
        WHERE user_id = $1 AND project_id = $2
    `;
    return db.query(query, [userId, projectId]);
};

// Check if user is already volunteering
export const isUserVolunteer = async (userId, projectId) => {
    const query = `
        SELECT * FROM volunteers
        WHERE user_id = $1 AND project_id = $2
    `;
    const result = await db.query(query, [userId, projectId]);
    return result.rows.length > 0;
};

// Get all projects a user volunteered for
export const getUserVolunteerProjects = async (userId) => {
    const query = `
        SELECT p.*
        FROM projects p
        JOIN volunteers v ON p.project_id = v.project_id
        WHERE v.user_id = $1
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
};