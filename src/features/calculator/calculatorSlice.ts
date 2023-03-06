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
            handleOperation(state, '+')
        },
        minus: state => {
            handleOperation(state, '-')
        },
        multiply: state => {
            handleOperation(state, '×')
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

const handleOperation = (state: CalculatorState, operator: string): void => {
    if (state.operator && !['+', '-', '×', '÷'].includes(state.lastKey)) {
        state.displayValue = getDisplayValue(state)
    }
    state.operator = operator
    state.savedValue = state.displayValue
    state.isFirstNumber = true
    state.lastKey = operator
}

const getDisplayValue = (state: CalculatorState, inputValue?: string): string => {
    if (inputValue) {
        return state.displayValue + inputValue
    }
    switch (state.operator) {
        case '':
            if (!state.lastOperation) {
                return state.displayValue
            }
            const lastOperator = state.lastOperation[0]
            const lastOperatedValue = state.lastOperation.slice(1)
            return getDisplayValue({
                ...state,
                savedValue: state.displayValue,
                displayValue: lastOperatedValue,
                operator: lastOperator
            })
        case '+':
            return String(Number(state.savedValue) + Number(state.displayValue))
        case '-':
            return String(Number(state.savedValue) - Number(state.displayValue))
        case '×':
            return String(Number(state.savedValue) * Number(state.displayValue))
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

export const {inputNumber, plus, minus, multiply, calculate} = calculatorSlice.actions

export default calculatorSlice