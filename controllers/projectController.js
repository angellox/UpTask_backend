import Project from '../models/Project.js';
import User from '../models/User.js';

const setProject = async (req, res) => {
    const project = new Project(req.body);
    project.creator = req.user._id;
    try {
        const projectSaved = await project.save();
        res.json(projectSaved);
    } catch (error) {
        console.log(error);
    }
};

// Getting all project of a user
const getProjects = async (req, res) => {
    const projects = await Project.find({
        '$or' : [
            {'collaborators': { $in: req.user }},
            {'creator': { $in: req.user }},
        ]
    })
        .select('-tasks');
    res.json(projects);
}

// Getting just one particular project of a user
const getProject = async (req, res) => {
    const { id } = req.params;
    const project = await Project.findById(id).populate({ path: 'tasks', populate: {
        path: 'completedBy', select: 'fullName'
    } }).populate('collaborators', 'fullName email');

    const reviewCollabs = collab => collab._id.toString() === req.user._id.toString();

    if(!project || project.creator.toString() !== req.user._id.toString() && !project.collaborators.some(reviewCollabs)) {
        const error = new Error('Action not valid');
        return res.status(404).json({ msg: error.message });
    }

    // Getting all task related to the current project (not necessary)
    //const tasks = await Task.find().where('project').equals(project._id);
    res.json(project);

};

const editProject = async (req, res) => {
    const { id } = req.params;
    const project = await Project.findById(id);

    if(!project || project.creator.toString() !== req.user._id.toString()) {
        const error = new Error('Not found');
        return res.status(404).json({ msg: error.message });
    }

    project.title = req.body.title || project.title;
    project.description = req.body.description || project.description;
    project.deadline = req.body.deadline || project.deadline;
    project.client = req.body.client || project.client;

    try {
        const projectUpdated = await project.save();
        res.json(projectUpdated);
    } catch (error) {
        console.log(error);
    }
};

const deleteProject = async (req, res) => {
    const { id } = req.params;
    const project = await Project.findById(id);

    if(!project || project.creator.toString() !== req.user._id.toString()) {
        const error = new Error('Not found');
        return res.status(404).json({ msg: error.message });
    }

    try {
        await project.deleteOne();
        res.json({ msg: 'Project has been removed successfully' });
    } catch (error) {
        console.log(error);
    }

};

const seachCollaborator = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email }).select('-isConfirmed -createdAt -password -token -updatedAt -__v');

    if(!user) {
        const error = new Error('User has not been found');
        return res.status(404).json({ msg: error.message });
    }
    res.json(user);
};

const addCollaborator = async (req, res) => {
    const { id } = req.params;
    const { email } = req.body;

    try {
        const project = await Project.findById(id);
        if(!project) {
            const error = new Error('Project not found');
            return res.status(404).json({ msg: error.message });
        }

        if(project.creator.toString() !== req.user._id.toString()) {
            const error = new Error('Action not valid');
            return res.status(406).json({ msg: error.message });
        }

        const user = await User.findOne({ email }).select('-isConfirmed -createdAt -password -token -updatedAt -__v');

        if(!user) {
            const error = new Error('User has not been found');
            return res.status(404).json({ msg: error.message });
        }

        if(project.creator.toString() === user._id.toString()) {
            const error = new Error('Project admin cannot be a collaborator');
            return res.status(406).json({ msg: error.message });
        }

        if(project.collaborators.includes(user._id)) {
            const error = new Error('This user already exists in this project');
            return res.status(406).json({ msg: error.message });
        }

        project.collaborators.push(user._id);
        await project.save();
        res.json({ msg: 'Collaborator added successfully' });

    } catch (error) {
        console.log(error);
    }  
};

const deleteCollaborator = async (req, res) => {
    const { id } = req.params;
    try {
        const project = await Project.findById(id);

        if(!project) {
            const error = new Error('Project not found');
            return res.status(404).json({ msg: error.message });
        }

        if(project.creator.toString() !== req.user._id.toString()) {
            const error = new Error('Action not valid');
            return res.status(406).json({ msg: error.message });
        }

        project.collaborators.pull(req.body.id);

        await project.save();
        res.json({ msg: 'Collaborator has been removed successfully' });

    } catch (error) {
        console.log(error);
    }  
};

export {
    getProjects,
    setProject,
    getProject,
    editProject,
    deleteProject,
    seachCollaborator,
    addCollaborator,
    deleteCollaborator
}