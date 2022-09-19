import express from 'express';
import {
    setTask,
    getTask,
    updateTask,
    deleteTask,
    changeStatus
} from '../controllers/taskController.js';
import checkAuth from '../middlewares/checkAuth.js';

const router = express.Router();

router.post('/', checkAuth, setTask);
router
    .route('/:id')
    .get(checkAuth, getTask)
    .put(checkAuth, updateTask)
    .delete(checkAuth, deleteTask);

router.post('/status/:id', checkAuth, changeStatus);

export default router;