import express from 'express';
import { router as authRoutes } from './routes/auth.js';
import { router as productRoutes } from './routes/products.js';
import { router as supplierRoutes } from './routes/suppliers.js';

export const app = express();

app.use(express.json()); // Enable JSON parsing

// Default API
app.get('/', (req, res) => {
    res.send('Welcome to AgriPro API!')
})

// Route for authentication
app.use('/auth', authRoutes);

// Route for products
app.use('/products', productRoutes);

// Route for suppliers
app.use('/suppliers', supplierRoutes);