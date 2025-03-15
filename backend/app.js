import express from 'express';
import { router as authRoutes } from './routes/auth.js';

export const app = express();

app.use(express.json()); // Enable JSON parsing

// Default API
app.get('/', (req, res) => {
    res.send('Hello World!')
})

// Route for authentication
app.use('/auth', authRoutes);