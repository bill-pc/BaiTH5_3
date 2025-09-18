import { Router } from 'express';
import { list as homeList } from '../controllers/productController.js';
const router = Router();
router.get('/', homeList);
export default router;
