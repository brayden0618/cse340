import { getUpcomingProjects, getProjectDetails } from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(10);

    res.render('projects', {
        title: 'Upcoming Service Projects',
        projects
    });
};

const showHomePage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);

    res.render('home', {
        title: 'Home',
        projects
    });
};

const showProjectDetailsPage = async (req, res) => {
    const projectId = req.params.id;

    const results = await getProjectDetails(projectId);
    const project = results[0];

    if (!project) {
        return res.status(404).render('errors/404', {
            title: 'Project Not Found'
        });
    }

    const categories = await getCategoriesByProjectId(projectId);

    res.render('project-details', {
        title: project.title,
        project,
        categories
    });
};

export {
    showProjectsPage,
    showHomePage,
    showProjectDetailsPage
};