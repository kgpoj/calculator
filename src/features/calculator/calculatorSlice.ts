/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CalculatorState {
  displayValue: string,
  prevOperator: string,
  expression: string
  prevOperation: string,
  prevKey: string,
  test: string,
  isFirstNumber: boolean
}

const initialState: CalculatorState = {
  displayValue: '0',
  prevOperator: '',
  expression: '',
  prevOperation: '',
  prevKey: '',
  test: '',
  isFirstNumber: true,
};

const handleInputDot = (isFirstNumber: boolean, currentDisplayValue: string): string => {
  if (isFirstNumber) {
    return '0.';
  }
  return currentDisplayValue.includes('.') ? currentDisplayValue : `${currentDisplayValue}.`;
};

const updateExpressionByDisplayValue = (state: CalculatorState): void => {
  const lastNumberReg = /(((?<=\D|^)-)?\d+(\.\d*)?)?$/;
  state.expression = state.expression.replace(lastNumberReg, state.displayValue);
  if (state.prevKey === '=') {
    state.expression = state.expression.replace('ERROR', '');
  }
};

const getExpressionResult = (expression: string): string => {
  expression = expression.replaceAll('--', '+');
  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  const func = new Function(`return ${expression}`);
  try {
    return Number.isFinite(func()) ? String(func()) : 'ERROR';
  } catch {
    return 'ERROR';
  }
};

const getDisplayValue = (expression: string, currentOperator: string) => {
  const lastPlusOrMinusIndex = expression.replaceAll(/(\d)[+-]/g, '$1#').lastIndexOf('#');
  if (['*', '/'].includes(currentOperator)) {
    return getExpressionResult(expression.slice(lastPlusOrMinusIndex + 1));
  }
  return getExpressionResult(expression);
};

const handleOperation = (state: CalculatorState, currentOperator: string): void => {
  state.expression = state.expression.replace(/[+\-*/]$/, '') || '0';

  state.displayValue = getDisplayValue(state.expression, currentOperator);
  state.prevOperator = currentOperator;
  state.expression += currentOperator;
  state.isFirstNumber = true;
  state.prevKey = currentOperator;
};

const getNumberOfDigits = (str: string): number => str.replaceAll(/\D/g, '').length;

const calculatorSlice = createSlice({
  name: 'calculator',
  initialState,
  reducers: {
    inputNumber: (state: CalculatorState, action: PayloadAction<string>) => {
      const inputValue = action.payload;
      const currentDisplayValue = state.displayValue;
      if (inputValue === '.') {
        state.displayValue = handleInputDot(state.isFirstNumber, currentDisplayValue);
      } else if (state.isFirstNumber || currentDisplayValue === 'ERROR') {
        state.displayValue = currentDisplayValue === '-0' ? `-${inputValue}` : inputValue;
      } else if (getNumberOfDigits(currentDisplayValue) < 9) {
        state.displayValue += inputValue;
      }
      updateExpressionByDisplayValue(state);
      state.isFirstNumber = false;
      state.prevKey = inputValue;
    },
    plus: (state) => {
      handleOperation(state, '+');
    },
    minus: (state) => {
      handleOperation(state, '-');
    },
    multiply: (state) => {
      handleOperation(state, '*');
    },
    divide: (state) => {
      handleOperation(state, '/');
    },
    calculate: (state) => {
      if (['+', '-', '*', '/'].includes(state.prevKey)) {
        state.expression += state.displayValue;
        state.prevOperation = state.prevOperator + state.displayValue;
      } else if (state.prevOperator) {
        state.prevOperation = state.prevOperator + state.displayValue;
      } else {
        state.expression = state.displayValue + state.prevOperation;
      }

      const expressionResult = getExpressionResult(state.expression);
      state.displayValue = expressionResult;
      state.expression = expressionResult;
      state.isFirstNumber = true;
      state.prevKey = '=';
      state.prevOperator = '';
    },
    percentage: (state) => {
      if (['+', '-', '*', '/'].includes(state.prevKey)) {
        state.displayValue = String(Number(state.displayValue) * Number(state.displayValue));
      }
      state.displayValue = String(Number(state.displayValue) / 100);
      updateExpressionByDisplayValue(state);
      state.prevKey = '%';
    },
    switchSign: (state) => {
      if (['+', '-', '*', '/'].includes(state.prevKey) || state.displayValue === '0') {
        state.displayValue = '-0';
      } else {
        state.displayValue = String(Number(state.displayValue) * -1);
      }
      updateExpressionByDisplayValue(state);
      state.prevKey = '+/-';
    },
    clearCurrent: (state) => {
      state.displayValue = '0';
      updateExpressionByDisplayValue(state);
      state.isFirstNumber = true;
      state.prevKey = 'C';
    },
  },
});

export const {
  inputNumber,
  plus,
  minus,
  multiply,
  divide,
  calculate,
  percentage,
  switchSign,
  clearCurrent,
} = calculatorSlice.actions;

export default calculatorSlice;
