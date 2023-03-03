import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface CalculatorState {
    displayValue: string,
    operator: string,
    savedValue: string,
    lastOperation: string,
    lastKey: string,
    isFirstNumber: boolean
}

const initialState: CalculatorState = {
    displayValue: '0',
    operator: '',
    savedValue: '0',
    lastOperation: '',
    lastKey: '',
    isFirstNumber: true
}

const calculatorSlice = createSlice({
    name: 'calculator',
    initialState,
    reducers: {
        inputNumber: (state: CalculatorState, action: PayloadAction<string>) => {
            const inputValue = action.payload;
            const currentDisplayValue = state.displayValue;
            if (inputValue === '.') {
                state.displayValue = handleInputDot(state)
            } else if (state.isFirstNumber) {
                state.displayValue = inputValue;
            } else if (getNumberOfDigits(currentDisplayValue) < 9) {
                state.displayValue = getDisplayValue(state, inputValue)
            }
            state.isFirstNumber = false
            state.lastKey = inputValue
        },
        plus: state => {
            if (['+', '-', '×', '÷'].includes(state.lastKey)) {
                return
            }
            state.operator = '+'
            state.displayValue = getDisplayValue(state)
            state.savedValue = state.displayValue
            state.isFirstNumber = true
            state.lastKey = '+'
        },
        calculate: state => {
            if (state.operator) {
                state.lastOperation = state.operator + state.displayValue
            }
            state.displayValue = getDisplayValue(state)
            state.savedValue = '0'
            state.operator = ''
            state.isFirstNumber = true
            state.lastKey = '='
        }
    },
});

const getDisplayValue = (state: CalculatorState, inputValue?: string): string => {
    if (inputValue) {
        return toFormatString(removeComma(state.displayValue + inputValue))
    }
    switch (state.operator) {
        case '':
            if (!state.lastOperation) {
                return state.displayValue
            }
            const lastOperator = state.lastOperation[0]
            const lastOperatedValue = state.lastOperation.slice(1)
            return getDisplayValue({...state, savedValue: lastOperatedValue, operator: lastOperator})
        case '+':
            return toFormatString(Number(removeComma(state.savedValue)) + Number(removeComma(state.displayValue)))
        default:
            return 'ERROR'
    }
}

const handleInputDot = ({displayValue, isFirstNumber}: CalculatorState): string => {
    if (isFirstNumber) {
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
    const [integerPart, decimalPart] = numberString.split('.')
    if (isFloatAndEndsWithZero) {
        return `${toFormatString(integerPart)}.${decimalPart}`
    }
    if (Number(numberString) >= 1e9) {
        return Number(numberString).toLocaleString('en', {
            notation: 'scientific'
        }).toLowerCase()
    }
    return Number(numberString).toLocaleString('en', {maximumFractionDigits: 9 - integerPart.length})
};

export const {inputNumber, plus, calculate} = calculatorSlice.actions

export default calculatorSlice