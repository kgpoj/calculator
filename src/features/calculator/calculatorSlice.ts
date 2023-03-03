import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface CalculatorState {
    displayValue: string,
    operator: string,
    savedValue: string,
    firstNumber: boolean
}

const initialState: CalculatorState = {
    displayValue: '0',
    operator: '',
    savedValue: '0',
    firstNumber: true
}

const calculatorSlice = createSlice({
    name: 'calculator',
    initialState,
    reducers: {
        inputNumber: (state: CalculatorState, action: PayloadAction<string>) => {
            const value = action.payload;
            const currentDisplayValue = state.displayValue;
            if (value === '.') {
                state.displayValue = handleInputDot(state)
            } else if (state.firstNumber) {
                state.displayValue = value;
            } else if (getNumberOfDigits(currentDisplayValue) < 9) {
                state.displayValue = toFormatString(removeComma(currentDisplayValue + value))
            }
            state.firstNumber = false
        },
        plus: state => {
            state.operator = '+'
            state.savedValue = state.displayValue
            state.firstNumber = true
        },
        calculate: state => {
            switch (state.operator) {
                case '+':
                    state.displayValue = toFormatString(Number(removeComma(state.savedValue)) + Number(removeComma(state.displayValue)))
            }
            state.savedValue = '0'
            state.operator = ''
            state.firstNumber = true
        }
    },
});

const handleInputDot = ({displayValue, operator}: CalculatorState): string => {
    if (displayValue === '0' || operator) {
        return '0.'
    }
    return displayValue.includes('.') ? displayValue : displayValue + '.';
}

const getNumberOfDigits = (str: string): number => {
    let numberCount = 0;
    for (const strElement of str) {
        if (!isNaN(Number(strElement))) {
            numberCount++
        }
    }
    return numberCount;
};

const removeComma = (numberString: string): string => {
    return numberString.replaceAll(',', '')
}

const toFormatString = (number: number | string): string => {
    const numberString = String(number)
    const isFloatAndEndsWithZero = /\.\d*0$/.test(numberString);
    if (isFloatAndEndsWithZero) {
        const [integerPart, decimalPart] = numberString.split('.')
        return `${toFormatString(integerPart)}.${decimalPart}`
    }
    if (Number(numberString) >= 1e9) {
        return Number(numberString).toExponential().replace('+', '')
    }
    return Number(numberString).toLocaleString('en', {maximumFractionDigits: 8})
};

export const {inputNumber, plus, calculate} = calculatorSlice.actions

export default calculatorSlice