import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface CalculatorState {
    displayValue: string,
    operator: string,
    savedValue: string,
    lastOperation: string,
    cachedOperation: string
    lastKey: string,
    isFirstNumber: boolean
}

const initialState: CalculatorState = {
    displayValue: '0',
    operator: '',
    savedValue: '0',
    lastOperation: '',
    cachedOperation: '',
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
                state.displayValue = state.displayValue + inputValue
            }
            state.isFirstNumber = false
            state.lastKey = inputValue
        },
        plus: state => {
            handleOperation(state, '+')
        },
        minus: state => {
            handleOperation(state, '-')
        },
        multiply: state => {
            handleOperation(state, '×')
        },
        divide: state => {
            handleOperation(state, '÷')
        },
        calculate: state => {
            if (state.operator) {
                state.lastOperation = state.operator + state.displayValue
            }
            state.displayValue = getDisplayValue(state, '')
            state.savedValue = '0'
            state.operator = ''
            state.isFirstNumber = true
            state.lastKey = '='
        }
    },
});

const handleOperation = (state: CalculatorState, currentOperator: string): void => {
    if (['+', '-'].includes(state.operator) && ['×', '÷'].includes(currentOperator)) {
        state.cachedOperation = state.operator + state.savedValue
    } else if (state.operator && !['+', '-', '×', '÷'].includes(state.lastKey)) {
        state.displayValue = getDisplayValue(state, currentOperator)
    }
    state.operator = currentOperator
    state.savedValue = state.displayValue
    state.isFirstNumber = true
    state.lastKey = currentOperator
}

const getCalculateResult = (saved: string, current: string, operator: string): string => {
    switch (operator) {
        case '+':
            return String(Number(saved) + Number(current))
        case '-':
            return String(Number(saved) - Number(current))
        case '×':
            return String(Number(saved) * Number(current))
        case '÷':
            return String(Number(saved) / Number(current))
        default:
            return current
    }
};

const getDisplayValue = (state: CalculatorState, currentOperator: string): string => {
    if (!state.operator) {
        const lastOperator = state.lastOperation[0]
        const lastOperatedValue = state.lastOperation.slice(1) || '0'
        return getCalculateResult(state.displayValue, lastOperatedValue, lastOperator)
    }
    const currentResult = getCalculateResult(state.savedValue, state.displayValue, state.operator)
    if (state.cachedOperation && !['×', '÷'].includes(currentOperator)) {
        const lastOperator = state.cachedOperation[0]
        const lastOperatedValue = state.cachedOperation.slice(1) || '0'
        state.cachedOperation = ''
        return getCalculateResult(currentResult, lastOperatedValue, lastOperator)
    }
    return currentResult
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

export const {inputNumber, plus, minus, multiply, divide, calculate} = calculatorSlice.actions

export default calculatorSlice