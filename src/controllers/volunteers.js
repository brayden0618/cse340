import {
    addVolunteer,
    removeVolunteer,
    isUserVolunteer
} from '../models/volunteers.js';

// Add volunteer
export const volunteerForProject = async (req, res) => {
    const userId = req.session.user.user_id;
    const projectId = req.params.id;

    if (!(await isUserVolunteer(userId, projectId))) {
        await addVolunteer(userId, projectId);
    }

    res.redirect(`/project/${projectId}`);
};

// Remove volunteer
export const unvolunteerFromProject = async (req, res) => {
    const userId = req.session.user.user_id;
    const projectId = req.params.id;

    await removeVolunteer(userId, projectId);

    res.redirect(`/project/${projectId}`);
};