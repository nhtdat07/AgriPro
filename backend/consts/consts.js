// Server
export const SERVER_PORT = 8080;

// HTTP status
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500
};

// Regex
export const REGEX = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    UPPERCASE: /[A-Z]/,
    LOWERCASE: /[a-z]/,
    DIGIT: /\d/,
    SPECIAL_CHAR: /[@$!%*?&]/
};

// Password
export const MIN_LENGTH_PASSWORD = 8;
export const PASSWORD_SALT = 10;

// Error
export const SQL_UNIQUE_ERROR_CODE = '23505';