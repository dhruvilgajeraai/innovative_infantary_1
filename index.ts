import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase, isDbConnected } from './db';
import { authRouter } from './routes/auth';
import { bookingsRouter } from './routes/bookings';
import { paymentsRouter } from './routes/payments';
import { dataRouter } from './routes/data';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Middlewares
app.use(cors({
  origin: '*', // Allow frontend access
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request Telemetry Logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.path.startsWith('/api')) {
      console.log(`[API] ${req.method} ${req.path} -> ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/data', dataRouter);

// Health & System Telemetry Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'The Champions Club Sports Complex API',
    database: isDbConnected() ? 'PostgreSQL Active (Live)' : 'Persistent Resilient Mode',
    features: {
      jwtAuth: true,
      bcryptHashing: true,
      razorpayPayments: true,
      zeroCollisionEngine: true
    }
  });
});

// Root Welcome Endpoint
app.get('/', (req, res) => {
  res.send('The Champions Club Enterprise Sports Complex API is running.');
});

// Start Server & Connect to Database
async function startServer() {
  await initDatabase();
  app.listen(PORT, () => {
    console.log(`🚀 [Server] Enterprise API Server listening on port ${PORT}`);
    console.log(`🔗 [API Health] http://localhost:${PORT}/api/health`);
  });
}

startServer();

export default app;
