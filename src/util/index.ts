const getScientificNotation = (displayValueNumber: number): string => {
    const exponent = displayValueNumber.toLocaleString('en', {
        notation: 'scientific'
    }).split('E')[1]
    const exponentLength = exponent.replace('-', '').length
    return displayValueNumber.toLocaleString('en', {
        notation: 'scientific',
        maximumSignificantDigits: 8 - exponentLength
    }).toLowerCase()
};

export const toFormatString = (displayValue: string): string => {
    const displayValueNumber = Number(displayValue);
    const absoluteDisplayValue = Math.abs(displayValueNumber);
    const isExceedDisplayRange = absoluteDisplayValue > 999999999 || (absoluteDisplayValue > 0 && absoluteDisplayValue < 1e-8)
    if (isExceedDisplayRange) {
        return getScientificNotation(displayValueNumber);
    }
    const isFloatAndEndsWithZero = /\.\d*0$/.test(displayValue);
    const [integerPart, decimalPart] = displayValue.split('.')
    if (isFloatAndEndsWithZero || displayValue.endsWith('.')) {
        return `${toFormatString(integerPart)}.${decimalPart}`
    }
    return Number(displayValue).toLocaleString('en', {maximumFractionDigits: 9 - integerPart.length})
};