import express from 'express';
import { router as authRoutes } from './routes/auth.js';
import { router as productRoutes } from './routes/products.js';
import { router as supplierRoutes } from './routes/suppliers.js';
import { router as customerRoutes } from './routes/customers.js';
import { router as purchasingRoutes } from './routes/purchasing.js';
import { router as inventoryRoutes } from './routes/inventory.js';
import { router as notificationRoutes } from './routes/notifications.js';
import { router as settingsRoutes } from './routes/settings.js';
import { router as sellingRoutes } from './routes/selling.js';
import { router as statisticsRoutes } from './routes/statistics.js';
import cors from "cors";

export const app = express();

app.use(express.json()); // Enable JSON parsing
app.use(
    cors({
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true,
    })
);

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

// Route for customers
app.use('/customers', customerRoutes);

// Route for purchasing
app.use('/purchase-orders', purchasingRoutes);

// Routes for inventory
app.use('/inventory', inventoryRoutes);

// Routes for notifications
app.use('/notifications', notificationRoutes);

// Routes for profile & settings
app.use('/settings', settingsRoutes);

// Routes for selling
app.use('/sales-invoices', sellingRoutes);

// Routes for statistics
app.use('/statistics', statisticsRoutes);