import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { adminList, createForm, create, editForm, update, remove } from '../controllers/productController.js';

const router = Router();

router.use(requireAuth);
router.get('/', adminList);
router.get('/create', createForm);
router.post('/create', create);
router.get('/:id/edit', editForm);
router.put('/:id', update);
router.delete('/:id', remove);

export default router;
