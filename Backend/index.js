import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import connectCloudinary from './config/cloudinary.js';
import bodyParser from 'body-parser'; // Use 'import' for body-parser
import helmet from 'helmet'

import incomeRoutes from './routes/incomeRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import budgetRoutes from './routes/budgetRoutes.js';
import userRouter from './routes/userRoute.js';



// Initialize the Express app
const app = express();

const allowedOrigins = [
  'https://country-spot-explore.vercel.app',
  'http://localhost:5173', 
 
   
  
];


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// CORS middleware configuration
app.use(cors({
  origin: (origin, callback) => {
    const allowed = [
      'https://country-spot-explore.vercel.app',
      'http://localhost:5173'
    ];
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowed.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));


app.options('*', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://country-spot-explore.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.status(200).end();
});




// Set up Helmet for Content Security Policy
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "script-src": ["'self'", "https://vercel.live"], // Allow scripts from vercel.live
      "default-src": ["'self'"],
    },
  })
);

// Middleware
app.use(express.json());
 app.use(bodyParser.json()); // Parse JSON bodies
 app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies


connectCloudinary();

app.use('/api/incomes', incomeRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/user', userRouter);




// Sample Route to Check Server Status
app.get('/', (req, res) => {
  res.send({ message: "Newlands-tea-factory backend is working!" });
});


// MongoDB connection
const mongoURI = process.env.MONGO_URI;

// Port configuration
const port = process.env.PORT || 4000;



if (!mongoURI) {
  console.error('Mongo URI is missing! Please add it to your .env file.');
  process.exit(1);
}

mongoose
  .connect(mongoURI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('Database connection error:', err);
    process.exit(1); // Exit the app if DB connection fails
  });

// Start the server
app.listen(port, () => console.log('Server is running on port: ' + port));
