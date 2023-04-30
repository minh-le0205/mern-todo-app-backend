import express from 'express';
import {
	createTask,
	getAllTasks,
	getCurrentUserTasks,
	updateTask,
	deleteTask,
} from '../controllers/taskController.js';

const router = express.Router();

router.post('/', createTask);
router.get('/', getAllTasks);
router.get('/my-tasks', getCurrentUserTasks);
router.put('/:taskId', updateTask);
router.delete('/:taskId', deleteTask);

export default router;
