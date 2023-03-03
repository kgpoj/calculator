export const toFormatString = (displayValue: string): string => {
    if (Number(displayValue) > 999999999) {
        return Number(displayValue).toLocaleString('en', {
            notation: 'scientific'
        }).toLowerCase()
    }
    const isFloatAndEndsWithZero = /\.\d*0$/.test(displayValue);
    const [integerPart, decimalPart] = displayValue.split('.')
    if (isFloatAndEndsWithZero || displayValue.endsWith('.')) {
        return `${toFormatString(integerPart)}.${decimalPart}`
    }
    return Number(displayValue).toLocaleString('en', {maximumFractionDigits: 9 - integerPart.length})
};