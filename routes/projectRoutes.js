import express from 'express';
import { 
    getProjects,
    setProject,
    getProject,
    editProject,
    deleteProject,
    seachCollaborator,
    addCollaborator,
    deleteCollaborator
} from "../controllers/projectController.js";
import checkAuth from '../middlewares/checkAuth.js';

const router = express.Router();

// Private routes
router
    .route('/')
    .get(checkAuth, getProjects)
    .post(checkAuth, setProject);
router
    .route('/:id')
    .get(checkAuth, getProject)
    .put(checkAuth, editProject)
    .delete(checkAuth, deleteProject);

//router.get('/tasks/:id', checkAuth, getTasks); It's not necessary, we can populate from Projects documents in MongoDB 
router.post('/collaborators', checkAuth, seachCollaborator);
router.post('/collaborators/:id', checkAuth, addCollaborator);
router.post('/delete-collaborators/:id', checkAuth, deleteCollaborator);


export default router;