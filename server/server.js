import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected');
} catch (err) {
  console.log('MongoDB connection error:', err);
}

app.use('/api/auth', (await import('./routes/auth.js')).default);
app.use('/api/jobs', (await import('./routes/jobs.js')).default);
app.use('/api/applications', (await import('./routes/applications.js')).default);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));