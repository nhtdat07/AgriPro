// Server
export const SERVER_PORT = 8080;

// HTTP status
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500
};

// Request handling
export const AUTHORIZATION_KEY = 'authorization';
export const TOKEN_PREFIX = 'Bearer ';

// Regex
export const REGEX = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE: /^0\d{9}$/,
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

// Empty values
export const EMPTY_STRING = '';
export const ZERO_LENGTH = 0;
export const SPACE = ' ';

// Default values
export const FIRST_IDX_ARRAY = 0;
export const SECOND_IDX_ARRAY = 1;
export const DEFAULT_TOKEN_EXPIRED_TIME = '20h';
export const DECIMAL_BASE = 10;
export const PATTERN_LIKE_SIGN = '%';

export const MIN_LIMIT = 1;
export const DEFAULT_LIMIT = 20;
export const MIN_OFFSET = 0;
export const DEFAULT_OFFSET = 0;

export const DEFAULT_PRODUCT_QUANTITY = 0;

// Product types
export const PRODUCT_TYPES = [
    'HẠT GIỐNG - CÂY TRỒNG',
    'PHÂN BÓN - ĐẤT TRỒNG',
    'THUỐC BẢO VỆ THỰC VẬT',
    'NÔNG CỤ',
    'GIA SÚC - GIA CẦM'
];