import express from 'express'
import { getMe, login, logout, signup } from '../controllers/auth.controller.js';
import { authUser } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/signup',signup);

router.post('/login',login);

router.get('/logout',logout);

router.get('/me', authUser,getMe);

export default router;