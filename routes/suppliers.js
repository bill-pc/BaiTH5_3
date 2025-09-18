import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { list, createForm, create, editForm, update, remove } from '../controllers/supplierController.js';

const router = Router();

router.use(requireAuth);
router.get('/', list);
router.get('/create', createForm);
router.post('/create', create);
router.get('/:id/edit', editForm);
router.put('/:id', update);
router.delete('/:id', remove);

export default router;
