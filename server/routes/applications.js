import express from 'express';
import Application from '../models/Application.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.post('/apply', authMiddleware, async (req, res) => {
  if (req.user.role !== 'student') return res.status(403).json({ msg: 'Forbidden' });
  const { jobId } = req.body;
  try {
    const application = new Application({ job: jobId, student: req.user.id, status: 'pending' });
    await application.save();
    res.json(application);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/my-applications', authMiddleware, async (req, res) => {
  if (req.user.role !== 'student') return res.status(403).json({ msg: 'Forbidden' });
  try {
    const applications = await Application.find({ student: req.user.id })
      .populate('job', 'title company description '); // Populate job details
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;