import express from 'express';
import { getUserInfo, updateUser } from '../controllers/userController.js';

const router = express.Router();

router.get('/me', getUserInfo);
router.put('/me', updateUser);

export default router;
