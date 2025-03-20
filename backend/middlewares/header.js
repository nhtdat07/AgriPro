import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import jwt from 'jsonwebtoken';
import * as consts from '../consts/consts.js';

export const authenticateUser = (req, res, next) => {
    const authHeader = req.headers[consts.AUTHORIZATION_KEY];
    if (!authHeader || !authHeader.startsWith(consts.TOKEN_PREFIX)) {
        return res.status(consts.HTTP_STATUS.UNAUTHORIZED).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(consts.SPACE)[consts.SECOND_IDX_ARRAY];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(consts.HTTP_STATUS.FORBIDDEN).json({ error: 'You do not have permission to access this resource.' });
    }
};
