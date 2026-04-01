import db from './db.js';

// Get all organizations
const getAllOrganizations = async () => {
    const query = `
        SELECT DISTINCT
            organization_id,
            name,
            description,
            contact_email,
            logo_filename
        FROM organizations
        ORDER BY name;
    `;

    const result = await db.query(query);
    return result.rows;
};

// Get a specific organization
const getOrganizationDetails = async (organizationId) => {
    const query = `
        SELECT
            organization_id,
            name,
            description,
            contact_email,
            logo_filename
        FROM organizations
        WHERE organization_id = $1;
    `;

    const result = await db.query(query, [organizationId]);

    return result.rows.length > 0 ? result.rows[0] : null;
};

/**
 * Creates a new organization in the database.
 */
const createOrganization = async (name, description, contactEmail, logoFilename) => {
    const query = `
      INSERT INTO organizations (name, description, contact_email, logo_filename)
      VALUES ($1, $2, $3, $4)
      RETURNING organization_id
    `;

    const query_params = [name, description, contactEmail, logoFilename];
    const result = await db.query(query, query_params);

    if (result.rows.length === 0) {
        throw new Error('Failed to create organization');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new organization with ID:', result.rows[0].organization_id);
    }

    return result.rows[0].organization_id;
};

// Update organization
const updateOrganization = async (organizationId, name, description, contactEmail, logoFilename) => {
  const query = `
    UPDATE organizations
    SET name = $1, description = $2, contact_email = $3, logo_filename = $4
    WHERE organization_id = $5
    RETURNING organization_id;
  `;

  const query_params = [name, description, contactEmail, logoFilename, organizationId];
  const result = await db.query(query, query_params);

  if (result.rows.length === 0) {
    throw new Error('Organization not found');
  }

  if (process.env.ENABLE_SQL_LOGGING === 'true') {
    console.log('Updated organization with ID:', organizationId);
  }

  return result.rows[0].organization_id;
};

export { getAllOrganizations, getOrganizationDetails, createOrganization, updateOrganization };