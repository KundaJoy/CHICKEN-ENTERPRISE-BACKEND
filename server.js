import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import chickenRoutes from './routes/chickenRoutes.js';
import saleRoutes from './routes/saleRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import reportRoutes from './routes/reportRoutes.js';

dotenv.config();
const app = express();

// Middleware
app.use(express.json());

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173', // frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // if you want cookies/auth headers
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chickens', chickenRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/reports', reportRoutes);

// Global error handler (optional but recommended)
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Server error' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
