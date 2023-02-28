import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface CalculatorState {
    displayValue: string
}

const initialState: CalculatorState = {
    displayValue: '0'
}

const calculatorSlice = createSlice({
    name: 'calculator',
    initialState,
    reducers: {
        inputNumber: (state: CalculatorState, action: PayloadAction<string>) => {
            const value = action.payload;
            const currentDisplayValue = state.displayValue;
            if (value === '.') {
                state.displayValue = handleInputDot(currentDisplayValue)
            } else if (currentDisplayValue === '0') {
                state.displayValue = value;
            } else if (getNumberOfDigits(currentDisplayValue) < 9) {
                state.displayValue = parseDisplayValue(currentDisplayValue + value)
            }
        }
    },
});

const handleInputDot = (displayValue: string): string => displayValue.includes('.') ? displayValue : displayValue + '.';

const getNumberOfDigits = (str: string): number => {
    let numberCount = 0;
    for (const strElement of str) {
        if (!isNaN(Number(strElement))) {
            numberCount++
        }
    }
    return numberCount;
};

const parseDisplayValue = (newValue: string): string => {
    const newValueWithoutComma = newValue.replaceAll(',', '')
    return separateWithComma(newValueWithoutComma)
};

const separateWithComma = (numberString: string): string => {
    const isFloatAndEndsWithZero = /\.\d*0$/.test(numberString);
    if (isFloatAndEndsWithZero) {
        const integerPart = numberString.split('.')[0]
        const decimalPart = numberString.split('.')[1];
        return `${separateWithComma(integerPart)}.${decimalPart}`
    }
    return Number(numberString).toLocaleString('en', {maximumFractionDigits: 8})
};

export const {inputNumber} = calculatorSlice.actions

export default calculatorSlice