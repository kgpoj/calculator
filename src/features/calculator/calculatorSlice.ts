import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface CalculatorState {
    displayValue: string,
    prevOperator: string,
    expression: string
    prevOperation: string,
    prevKey: string,
    isFirstNumber: boolean
}

const initialState: CalculatorState = {
    displayValue: '0',
    prevOperator: '',
    expression: '',
    prevOperation: '',
    prevKey: '',
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
                if (state.isFirstNumber) {
                    state.displayValue = '0.'
                    state.expression += '0.'
                } else if (!currentDisplayValue.includes('.')) {
                    state.displayValue += '.'
                    state.expression += '.'
                }
            } else if (state.isFirstNumber) {
                state.displayValue = inputValue;
                state.expression += inputValue
            } else if (getNumberOfDigits(currentDisplayValue) < 9) {
                state.displayValue += inputValue
                state.expression += inputValue
            }
            state.isFirstNumber = false
            state.prevKey = inputValue
        },
        plus: state => {
            handleOperation(state, '+')
        },
        minus: state => {
            handleOperation(state, '-')
        },
        multiply: state => {
            handleOperation(state, '*')
        },
        divide: state => {
            handleOperation(state, '/')
        },
        calculate: state => {
            if (['+', '-', '*', '/'].includes(state.prevKey)) {
                state.expression += state.displayValue
                state.prevOperation = state.prevOperator + state.displayValue
            } else if (state.prevOperator) {
                state.prevOperation = state.prevOperator + state.displayValue
            } else {
                state.expression = state.displayValue + state.prevOperation
            }

            const expressionResult = getExpressionResult(state.expression);
            state.displayValue = expressionResult
            state.expression = expressionResult
            state.isFirstNumber = true
            state.prevKey = '='
            state.prevOperator = ''
        }
    },
});

const getExpressionResult = (expression: string): string => {
    // eslint-disable-next-line no-new-func
    const func = new Function(`return ${expression}`)
    return String(func() || 0)
}

const handleOperation = (state: CalculatorState, currentOperator: string): void => {
    state.expression = state.expression.replace(/[+\-*/]$/, '') || '0'

    const lastPlusOrMinusIndex = state.expression.replaceAll(/(\d)[+-]/g, '$1#').lastIndexOf('#')
    if (['*', '/'].includes(currentOperator) && lastPlusOrMinusIndex !== -1) {
        state.displayValue = getExpressionResult(state.expression.slice(lastPlusOrMinusIndex + 1))
    } else {
        state.displayValue = getExpressionResult(state.expression)
    }
    state.prevOperator = currentOperator
    state.expression += currentOperator
    state.isFirstNumber = true
    state.prevKey = currentOperator
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