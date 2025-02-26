import express from 'express';
import Job from '../models/Job.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const jobs = await Job.find().populate('postedBy', 'name');
  res.json(jobs);
});

router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name');
    if (!job) return res.status(404).json({ msg: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  if (req.user.role !== 'recruiter') return res.status(403).json({ msg: 'Forbidden' });
  const { title, company, description, eligibility } = req.body;
  try {
    const job = new Job({ title, company, description, eligibility, postedBy: req.user.id });
    await job.save();
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add this new route for recruiters
router.get('/my-jobs', authMiddleware, async (req, res) => {
  if (req.user.role !== 'recruiter') return res.status(403).json({ msg: 'Forbidden' });
  try {
    const jobs = await Job.find({ postedBy: req.user.id }).populate('postedBy', 'name');
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch recruiter jobs' });
  }
});

export default router;