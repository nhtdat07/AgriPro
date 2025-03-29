import * as consts from '../consts/consts.js';

export const transformToPatternQueryLike = (str) => {
    if (str) {
        return consts.PATTERN_LIKE_SIGN + str + consts.PATTERN_LIKE_SIGN;
    }
    return str;
}

export const formatDate = (date) => {
    if (!date) return consts.EMPTY_STRING;
    return new Intl.DateTimeFormat(consts.DEFAULT_TIME_FORMAT, consts.TIME_OPTIONS)
        .format(date).replace(consts.COMMA, consts.EMPTY_STRING);
}