import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import bodyParser from 'body-parser'; // Use 'import' for body-parser
import ticketRoutes from "./routes/ticketRoutes.js";
import helmet from 'helmet'

import incomeRoutes from './routes/incomeRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import budgetRoutes from './routes/budgetRoutes.js';



// Initialize the Express app
const app = express();

const allowedOrigins = [
  'https://newlands-tea-factory-bcjthgnry-pasindus-projects-e32111c9.vercel.app',
  'localhost:5173',  
  
];


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// CORS middleware configuration
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g., mobile apps, CURL)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('The CORS policy for this site does not allow access from the specified origin.'));
      }
    }
  })
);





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

// Connect Cloudinary
connectCloudinary();

// API Endpoints
app.use('/api/user', userRouter);
app.use("/api/tickets", ticketRoutes);
app.use('/api/incomes', incomeRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/budgets', budgetRoutes);



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
