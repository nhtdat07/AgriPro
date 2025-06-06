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
    PHONE: /^\d{8,12}$/,
    OTP: /^\d{6}$/,
    UPPERCASE: /[A-Z]/,
    LOWERCASE: /[a-z]/,
    DIGIT: /\d/,
    SPECIAL_CHAR: /[@$!%*?&#]/
};

// Password
export const MIN_LENGTH_PASSWORD = 8;
export const PASSWORD_SALT = 10;
export const RESET_TOKEN_EXPIRED_TIME = '1h';
export const EXPIRED_RESET_TOKEN_ERROR_NAME = 'TokenExpiredError'

// OTP
export const MIN_OTP = 100000;
export const OTP_STEP = 900000;
export const OTP_SALT = 10;
export const OTP_EXPIRED_TIME = 5 * 60 * 1000; // 5 minutes

// Gmail
export const MAIL_SERVICE = 'gmail';
export const SEND_OTP_SUBJECT = 'Mã OTP để đặt lại mật khẩu cho AgriPro';

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
export const COMMA = ',';
export const DEFAULT_START_COUNT = 1;
export const INC = 1;

export const MIN_LIMIT = 1;
export const DEFAULT_LIMIT = 20;
export const MIN_OFFSET = 0;
export const DEFAULT_OFFSET = 0;

export const MIN_VALID_PRICE = 1;
export const MIN_VALID_QUANTITY = 1;

export const DEFAULT_PRODUCT_QUANTITY = 0;
export const DEFAULT_TOTAL_PAYMENT = 0;

// Time option
export const TIME_OPTIONS = {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
};
export const TIME_OPTIONS_UTC = {
    timeZone: 'UTC',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
};
export const DEFAULT_TIME_FORMAT = 'en-CA';

// Product types
export const PRODUCT_TYPES = [
    'HẠT GIỐNG - CÂY TRỒNG',
    'PHÂN BÓN - ĐẤT TRỒNG',
    'THUỐC BẢO VỆ THỰC VẬT',
    'NÔNG CỤ',
    'GIA SÚC - GIA CẦM'
];

// Config keys
export const CONFIG_KEYS = {
    WARNING_EXPIRED: 'warning_expired',
    WARNING_OUT_OF_STOCK: 'warning_out_of_stock'
}

// Config types
export const CONFIG_TYPES = [
    'INVENTORY_PARAMS',
    'PRINT_FORMAT'
];

// Noti types
export const NOTI_TYPES = {
    SUCCESSFULLY_RECORDED: 'GHI NHẬN THÀNH CÔNG',
    WARNING_EXPIRED: 'CẢNH BÁO HẾT HẠN SỬ DỤNG',
    WARNING_OUT_OF_STOCK: 'CẢNH BÁO HẾT HÀNG'
}