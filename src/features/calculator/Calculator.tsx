import React from 'react';
import styled from "styled-components";
import {inputNumber} from "./calculatorSlice";
import {useAppDispatch, useAppSelector} from "../../app/hooks";

enum buttonTheme {
    NUMBER,
    FUNCTION,
    OPERATOR
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
`
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
`
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
`

const Button = styled.button.attrs(props => ({
    theme: props.theme || buttonTheme.NUMBER
}))`
  color: ${({theme}) => theme === buttonTheme.FUNCTION ? 'black' : 'white'};
  background-color: ${({theme}) => {
    switch (theme) {
      case buttonTheme.NUMBER:
        return '#333'
      case buttonTheme.OPERATOR:
        return '#f1a33c'
      case buttonTheme.FUNCTION:
        return '#a5a5a5'
      default:
        return '#333'
    }
  }};
  border-radius: 50%;
  width: 80%;
  height: 80%;
  border: none;
  padding: 0;
  font-size: 50px;
`
const Calculator = () => {
    const displayValue = useAppSelector(state => state.displayValue);
    const dispatch = useAppDispatch();

    return (
        <StyledWrapper>
            <DisplayArea type="text" value={displayValue} readOnly/>
            <OperationWrapper>
                <Button theme={buttonTheme.FUNCTION}>C</Button>
                <Button theme={buttonTheme.FUNCTION}>+/-</Button>
                <Button theme={buttonTheme.FUNCTION}>%</Button>
                <Button theme={buttonTheme.OPERATOR}>÷</Button>
                <Button theme={buttonTheme.NUMBER} onClick={() => dispatch(inputNumber('7'))}>7</Button>
                <Button theme={buttonTheme.NUMBER} onClick={() => dispatch(inputNumber('8'))}>8</Button>
                <Button theme={buttonTheme.NUMBER} onClick={() => dispatch(inputNumber('9'))}>9</Button>
                <Button theme={buttonTheme.OPERATOR}>×</Button>
                <Button theme={buttonTheme.NUMBER} onClick={() => dispatch(inputNumber('4'))}>4</Button>
                <Button theme={buttonTheme.NUMBER} onClick={() => dispatch(inputNumber('5'))}>5</Button>
                <Button theme={buttonTheme.NUMBER} onClick={() => dispatch(inputNumber('6'))}>6</Button>
                <Button theme={buttonTheme.OPERATOR}>-</Button>
                <Button theme={buttonTheme.NUMBER} onClick={() => dispatch(inputNumber('1'))}>1</Button>
                <Button theme={buttonTheme.NUMBER} onClick={() => dispatch(inputNumber('2'))}>2</Button>
                <Button theme={buttonTheme.NUMBER} onClick={() => dispatch(inputNumber('3'))}>3</Button>
                <Button theme={buttonTheme.OPERATOR}>+</Button>
                <Button theme={buttonTheme.NUMBER} onClick={() => dispatch(inputNumber('0'))}>0</Button>
                <Button theme={buttonTheme.NUMBER} onClick={() => dispatch(inputNumber('.'))}>.</Button>
                <Button theme={buttonTheme.OPERATOR}>=</Button>
            </OperationWrapper>
        </StyledWrapper>
    )
}
export default Calculator;