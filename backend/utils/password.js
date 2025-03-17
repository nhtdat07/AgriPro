import * as consts from '../consts/consts.js';

export const validateEmail = (email) => {
    return consts.REGEX.EMAIL.test(email);
};

export const validatePassword = (password) => {
    return (
        password.length >= consts.MIN_LENGTH_PASSWORD &&
        consts.REGEX.UPPERCASE.test(password) &&
        consts.REGEX.LOWERCASE.test(password) &&
        consts.REGEX.DIGIT.test(password) &&
        consts.REGEX.SPECIAL_CHAR.test(password)
    );
};