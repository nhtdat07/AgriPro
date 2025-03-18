import * as consts from '../consts/consts.js'

export class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = consts.HTTP_STATUS.BAD_REQUEST;
    }
}

export class UnauthorizedError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = consts.HTTP_STATUS.UNAUTHORIZED;
    }
}

export class ConflictError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = consts.HTTP_STATUS.CONFLICT;
    }
}

export class InternalError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = consts.HTTP_STATUS.INTERNAL_SERVER_ERROR;
    }
}

// Handle errors
export function errorHandler(err, res) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ error: err.message || 'Internal server error' });
}