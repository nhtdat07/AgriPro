import * as consts from '../consts/consts.js';

export const transformToPatternQueryLike = (str) => {
    if (str) {
        return consts.PATTERN_LIKE_SIGN + str + consts.PATTERN_LIKE_SIGN;
    }
    return str;
}