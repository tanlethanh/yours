export const formatStringText = (str: String) => {
    if (str.length == 0) {
        return str;
    }

    const lowerStr = str.toLowerCase();
    return lowerStr[0].toUpperCase() + lowerStr.substring(1);
};

export const isEqualPureString = (str1: String, str2: String) => {
    return str1.toLowerCase() == str2.toLowerCase();
};
