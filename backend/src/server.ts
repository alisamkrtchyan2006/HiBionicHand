import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/error-handler.middleware';

// Import routes
import authRoutes from './routes/auth.routes';
import productsRoutes from './routes/products.routes';
import newsRoutes from './routes/news.routes';
import reviewsRoutes from './routes/reviews.routes';
import partnersRoutes from './routes/partners.routes';
import contactsRoutes from './routes/contacts.routes';
import usersRoutes from './routes/users.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'hiBionicHand API is running' });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productsRoutes);
app.use('/api/v1/news', newsRoutes);
app.use('/api/v1/reviews', reviewsRoutes);
app.use('/api/v1/partners', partnersRoutes);
app.use('/api/v1/contacts', contactsRoutes);
app.use('/api/v1/users', usersRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api/v1`);
});

