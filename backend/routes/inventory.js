import express from 'express';
import { authenticateUser } from '../middlewares/header.js';
import * as inventoryMiddlewares from '../middlewares/inventory.js';
import * as inventoryControllers from '../controllers/inventory.js';

export const router = express.Router();

// GET /inventory
router.get('/',
    authenticateUser, inventoryMiddlewares.validateGetListInventoryData, inventoryControllers.getListInventoryController
);