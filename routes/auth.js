import { Router } from 'express';
import { getRegister, postRegister, getLogin, postLogin, logout, getForgot, postForgot } from '../controllers/authController.js';
const router = Router();

router.get('/register', getRegister);
router.post('/register', postRegister);
router.get('/login', getLogin);
router.post('/login', postLogin);
router.post('/logout', logout);
router.get('/forgot', getForgot);
router.post('/forgot', postForgot);

export default router;
