import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import prisma from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';
import { generateFitSummary } from '../lib/gemini';

const router = Router();

router.get('/', authenticate, async (req: AuthRequest, res: any) => {
  try {
    const referrals = await prisma.referral.findMany({
      where: { userId: req.user?.userId },
      include: {
        job: { select: { title: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(referrals);
  } catch (error) {
    console.error('Get referrals error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', authenticate, [
  body('jobId').notEmpty().withMessage('Job ID is required'),
  body('friendName').notEmpty().withMessage('Friend name is required'),
  body('friendEmail').isEmail().withMessage('Valid friend email is required'),
  body('note').optional().isString()
], async (req: AuthRequest, res: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { jobId, friendName, friendEmail, note } = req.body;
  const userId = req.user!.userId;

  try {
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) return res.status(404).json({ error: 'Job not found' });

    const fitSummary = await generateFitSummary(job.title, job.description, friendName, friendEmail);

    const referral = await prisma.referral.create({
      data: {
        userId,
        jobId,
        friendName,
        friendEmail,
        note,
        fitSummary,
        status: 'SUBMITTED'
      }
    });

    res.json(referral);
  } catch (error) {
    console.error('Create referral error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/:id/status', authenticate, [
  body('status').isIn(['SUBMITTED', 'INTERVIEWED', 'HIRED', 'REJECTED']).withMessage('Invalid status')
], async (req: AuthRequest, res: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { status } = req.body;
  const referralId = req.params.id;
  const userId = req.user!.userId;

  try {
    const referral = await prisma.referral.findUnique({ where: { id: referralId } });
    if (!referral) return res.status(404).json({ error: 'Referral not found' });
    if (referral.userId !== userId) return res.status(403).json({ error: 'Forbidden' });

    const updatedReferral = await prisma.referral.update({
      where: { id: referralId },
      data: { status }
    });

    res.json(updatedReferral);
  } catch (error) {
    console.error('Update referral status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

