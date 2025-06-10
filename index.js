import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import recommendationRoutes from './routes/recommendationRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Database Connection
connectDB();

// Routes
app.use('/', (req,res)=>{
  res.json({message:"server is running"})
});
app.use('/api/recommendations', recommendationRoutes);

app.get('/', (req, res) => {
  res.send('Skin Care Recommendation API');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});