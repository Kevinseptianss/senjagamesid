import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import winpayCallbackRouter from './src/api/winpayCallback.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'],
  methods: ['GET', 'POST'],
  allowedHeaders: [
    'Content-Type',
    'X-Timestamp',
    'X-Partner-ID',
    'X-Signature',
    'X-External-ID',
    'Channel-ID'
  ]
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`, {
    headers: req.headers,
    query: req.query,
    body: req.method === 'POST' ? req.body : undefined
  });
  next();
});

// Routes
app.use('/api/winpay', winpayCallbackRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'senjagames-callback-server'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    responseCode: '5000000',
    responseMessage: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    responseCode: '4040000',
    responseMessage: 'Endpoint not found'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 SenjaGames Callback Server running on port ${PORT}`);
  console.log(`📡 WinPay Callback URL: http://localhost:${PORT}/api/winpay/v1.0/transfer-va/payment`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
});

export default app;
