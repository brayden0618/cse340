CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

CREATE TABLE projects (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(150) NOT NULL,
    project_date DATE NOT NULL,
    FOREIGN KEY (organization_id) REFERENCES organizations(organization_id)
);

INSERT INTO projects (organization_id, title, description, location, project_date)
VALUES 
-- Projects for Bright Future Builders
(1, 'Community Park Renovation', 'Renovating the local community park with new playground equipment and landscaping.', 'Local Community Park', '2024-07-01'),
(1, 'Sustainable Housing Initiative', 'Building affordable, eco-friendly housing for low-income families.', 'Urban Development Zone', '2024-08-15'),
(1, 'Neighborhood Clean-Up', 'Organizing monthly clean-up events to keep our community clean and green.', 'Local Neighborhood', '2024-06-01'),
(1, 'Youth Construction Workshops', 'Providing hands-on construction workshops for local youth to learn valuable skills.', 'Local Community Center', '2024-09-01'),
(1, 'Community Art Mural', 'Creating a community mural to beautify the neighborhood and promote local artists.', 'Main Street', '2024-10-01'),
-- Projects for Green Harvest Growers
(2, 'Urban Garden Expansion', 'Expanding the urban garden to include more plots and educational workshops.', 'Local Community Garden', '2024-12-31'),
(2, 'Farm-to-School Program', 'Partnering with local schools to provide fresh produce and nutrition education.', 'Local School', '2024-09-01'),
(2, 'Community Composting', 'Implementing a community composting program to reduce waste and enrich soil.', 'Local Community Center', '2024-07-01'),
(2, 'Greenhouse Construction', 'Building a greenhouse to extend the growing season and increase food production.', 'Local Agricultural Area', '2024-08-15'),
(2, 'Sustainable Farming Workshops', 'Offering workshops on sustainable farming practices for local residents.', 'Local Community Center', '2024-10-01'),
-- Projects for UnityServe Volunteers
(3, 'Holiday Food Drive', 'Collecting and distributing food donations to families in need during the holiday season.', 'Local Community Center', '2024-11-01'),
(3, 'Community Clean-Up Day', 'Organizing a day of service to clean up local parks and public spaces.', 'Local Community Center', '2024-10-15'),
(3, 'Senior Assistance Program', 'Providing support and companionship to senior citizens in the community.', 'Local Community Center', '2024-09-01'),
(3, 'Youth Mentorship Program', 'Connecting local youth with mentors to provide guidance and support.', 'Local Community Center', '2024-08-01'),
(3, 'Clothing Drive', 'Collecting and distributing clothing donations to those in need.', 'Local Community Center', '2024-07-01');