export * from "./ToastCustom";
export * from "./PrimaryButton";

export const ZeroDefault = () => {
    return 0;
};

export function randInt(st: number, en: number) {
    return Math.floor(Math.random() * (en - st)) + st;
}

export function shuffleArray(array: Array<any>) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export const formatStringText = (str: String) => {
    if (str.length == 0) {
        return str;
    }

    const lowerStr = str.toLowerCase();
    return lowerStr[0].toUpperCase() + lowerStr.substring(1);
};

export const isEqualPureString = (str1: String, str2: String) => {
    return str1.trim().toLowerCase() == str2.trim().toLowerCase();
};
