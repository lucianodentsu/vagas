import { Router } from 'express';
import { listReports, getReport, createReport, deleteReport } from '../controllers/reportController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', listReports);
router.get('/:id', getReport);
router.post('/', createReport);
router.delete('/:id', authorize('ADMIN'), deleteReport);

export default router;
