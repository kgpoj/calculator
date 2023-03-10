import React from 'react';
import styled from 'styled-components';
import {
  inputNumber,
  plus,
  calculate,
  minus,
  multiply,
  divide,
  percentage,
  switchSign,
  clearCurrent,
} from './calculatorSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { toFormatString } from '../../util';

enum ButtonTheme {
  NUMBER,
  FUNCTION,
  OPERATOR,
}

const StyledWrapper = styled.div`
  max-width: 500px;
  height: 800px;
  display: flex;
  flex-direction: column;
  background-color: black;
  justify-content: space-between;
  padding: 0 10px 40px;
  margin: 0 auto;
`;
const DisplayArea = styled.input`
  background-color: black;
  border: none;
  color: white;
  font-size: 80px;
  text-align: end;
  flex: 1;

  &:focus-visible {
    outline: none;
  }
`;
const OperationWrapper = styled.div`
  height: 625px;
  display: grid;
  grid-template-columns: repeat(4, 25%);
  grid-template-rows: repeat(5, 20%);
  place-items: center;

  & :nth-last-child(3) {
    grid-column-start: 1;
    grid-column-end: 3;
    border-radius: 50px;
    width: 90%;
    text-align: left;
    padding-left: 16%;
  }
`;

interface CalculatorButtonProps {
  active?: boolean
}

const Button = styled.button.attrs<CalculatorButtonProps>((props) => ({
  theme: props.theme || ButtonTheme.NUMBER,
  active: props.active || false,
}))<CalculatorButtonProps>`
  color: ${({ theme }) => (theme === ButtonTheme.FUNCTION ? 'black' : 'white')};
  background-color: ${({ theme }) => {
    switch (theme) {
      case ButtonTheme.NUMBER:
        return '#333';
      case ButtonTheme.OPERATOR:
        return '#f1a33c';
      case ButtonTheme.FUNCTION:
        return '#a5a5a5';
      default:
        return '#333';
    }
  }};
  border-radius: 50%;
  width: 80%;
  height: 80%;
  border: none;
  padding: 0;
  font-size: 50px;
  transition: all .2s cubic-bezier(.645, .045, .355, 1);
  ${(props) => (
    props.active
      ? {
        backgroundColor: 'white',
        color: '#f1a33c',
      }
      : {}
  )
}
`;
function Calculator() {
  const displayValue = useAppSelector((state) => state.displayValue);
  const prevKey = useAppSelector((state) => state.prevKey);
  const dispatch = useAppDispatch();

  return (
    <StyledWrapper>
      <DisplayArea type="text" value={toFormatString(displayValue)} readOnly />
      <OperationWrapper>
        <Button theme={ButtonTheme.FUNCTION} onClick={() => dispatch(clearCurrent())}>C</Button>
        <Button theme={ButtonTheme.FUNCTION} onClick={() => dispatch(switchSign())}>+/-</Button>
        <Button theme={ButtonTheme.FUNCTION} onClick={() => dispatch(percentage())}>%</Button>
        <Button
          theme={ButtonTheme.OPERATOR}
          onClick={() => dispatch(divide())}
          active={prevKey === '/'}
        >
          ÷
        </Button>
        <Button theme={ButtonTheme.NUMBER} onClick={() => dispatch(inputNumber('7'))}>7</Button>
        <Button theme={ButtonTheme.NUMBER} onClick={() => dispatch(inputNumber('8'))}>8</Button>
        <Button theme={ButtonTheme.NUMBER} onClick={() => dispatch(inputNumber('9'))}>9</Button>
        <Button
          theme={ButtonTheme.OPERATOR}
          onClick={() => dispatch(multiply())}
          active={prevKey === '*'}
        >
          ×
        </Button>
        <Button theme={ButtonTheme.NUMBER} onClick={() => dispatch(inputNumber('4'))}>4</Button>
        <Button theme={ButtonTheme.NUMBER} onClick={() => dispatch(inputNumber('5'))}>5</Button>
        <Button theme={ButtonTheme.NUMBER} onClick={() => dispatch(inputNumber('6'))}>6</Button>
        <Button
          theme={ButtonTheme.OPERATOR}
          onClick={() => dispatch(minus())}
          active={prevKey === '-'}
        >
          -
        </Button>
        <Button theme={ButtonTheme.NUMBER} onClick={() => dispatch(inputNumber('1'))}>1</Button>
        <Button theme={ButtonTheme.NUMBER} onClick={() => dispatch(inputNumber('2'))}>2</Button>
        <Button theme={ButtonTheme.NUMBER} onClick={() => dispatch(inputNumber('3'))}>3</Button>
        <Button
          theme={ButtonTheme.OPERATOR}
          onClick={() => dispatch(plus())}
          active={prevKey === '+'}
        >
          +
        </Button>
        <Button theme={ButtonTheme.NUMBER} onClick={() => dispatch(inputNumber('0'))}>0</Button>
        <Button theme={ButtonTheme.NUMBER} onClick={() => dispatch(inputNumber('.'))}>.</Button>
        <Button theme={ButtonTheme.OPERATOR} onClick={() => dispatch(calculate())}>=</Button>
      </OperationWrapper>
    </StyledWrapper>
  );
}
export default Calculator;
