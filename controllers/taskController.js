import Project from '../models/Project.js';
import Task from '../models/Task.js';

const setTask = async (req, res) => {
    const { project } = req.body;
    
    const projectSearched = await Project.findById(project);

    if(!projectSearched) {
        const error = new Error('This project does not exist yet');
        return res.status(404).json({ msg: error.message });
    }

    if(projectSearched.creator.toString() !== req.user._id.toString()) {
        const error = new Error('You are not allowed to do this action');
        return res.status(403).json({ msg: error.message });
    }

    try {
        const taskSaved = await Task.create(req.body);
        projectSearched.tasks.push(taskSaved._id);
        await projectSearched.save();

        res.json(taskSaved);
    } catch (error) {
        console.log(error);
    }
};

const getTask = async (req, res) => {
    const { id } = req.params;
    
    const task = await Task.findById(id).populate('project');

    if(!task) {
        const error = new Error('Task is not found');
        return res.status(404).json({ msg: error.message });
    }
    
    if(task.project.creator.toString() !== req.user._id.toString()) {
        const error = new Error('You are not allowed to do this action');
        return res.status(403).json({ msg: error.message });
    }

    res.json(task);
};

const updateTask = async (req, res) => {
    const { id } = req.params;
    
    const task = await Task.findById(id).populate('project');

    if(!task) {
        const error = new Error('Task is not found');
        return res.status(404).json({ msg: error.message });
    }
    
    if(task.project.creator.toString() !== req.user._id.toString()) {
        const error = new Error('You are not allowed to do this action');
        return res.status(403).json({ msg: error.message });
    }

    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.priority = req.body.priority || task.priority;
    task.deadline = req.body.deadline || task.deadline;

    try {
        const taskUpdated = await task.save();
        res.json(taskUpdated);
    } catch (error) {
        console.log(error);
    }

};

const deleteTask = async (req, res) => {
    const { id } = req.params;
    
    const task = await Task.findById(id).populate('project');

    if(!task) {
        const error = new Error('Task is not found');
        return res.status(404).json({ msg: error.message });
    }
    
    if(task.project.creator.toString() !== req.user._id.toString()) {
        const error = new Error('You are not allowed to do this action');
        return res.status(403).json({ msg: error.message });
    }

    try {
        const project = await Project.findById(task.project);
        project.tasks.pull(task._id);

        await Promise.allSettled([project.save(), task.deleteOne()]);

        res.json({ msg: 'The task has been deleted successfully' });
    } catch (error) {
        console.log(error);
    }
};

const changeStatus = async (req, res) => {
    const { id } = req.params;
    
    const task = await Task.findById(id).populate('project');

    if(!task) {
        const error = new Error('Task is not found');
        return res.status(404).json({ msg: error.message });
    }

    const reviewCollabs = collab => collab._id.toString() === req.user._id.toString();

    if(task.project.creator.toString() !== req.user._id.toString() && !task.project.collaborators.some(reviewCollabs)) {
        const error = new Error('You are not allowed to do this action');
        return res.status(403).json({ msg: error.message });
    }

    // Change status of the task
    task.status = !task.status;
    // Setting up the user which completes the task
    task.completedBy = req.user._id;
    await task.save();

    const taskStoraged = await Task.findById(id).populate('project').populate('completedBy');
    res.json(taskStoraged);
};


export {
    setTask,
    getTask,
    updateTask,
    deleteTask,
    changeStatus
}