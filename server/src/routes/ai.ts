import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate, AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';
import { suggestNote } from '../lib/gemini';

const router = Router();

router.post('/suggest-note', authenticate, [
  body('jobId').notEmpty().withMessage('Job ID is required'),
  body('friendName').notEmpty().withMessage('Friend name is required')
], async (req: AuthRequest, res: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { jobId, friendName } = req.body;

  try {
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) return res.status(404).json({ error: 'Job not found' });

    const note = await suggestNote(job.title, job.location, job.description, friendName);
    res.json({ note });
  } catch (error) {
    console.error('Suggest note error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

