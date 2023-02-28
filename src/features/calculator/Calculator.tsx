import React from 'react';
import styled from "styled-components";
import {inputNumber} from "./calculatorSlice";
import {useAppDispatch, useAppSelector} from "../../app/hooks";

const StyledWrapper = styled.div`
  max-width: 500px;
  height: 800px;
  display: flex;
  flex-direction: column;
  background-color: black;
  justify-content: space-between;
  padding: 5px;
`
const DisplayArea = styled.input`
  background-color: black;
  border: none;
  color: white;
  font-size: 80px;
  text-align: end;
`
const OperationArea = styled.div`
  display: flex;
`
const NumberButton = styled.button`
  color: white;
  background-color: #333;
  border-radius: 50%;
  width: 25%;
  height: 0;
  padding-bottom: 25%;
  border: none;
  font-size: 50px;
`
const Calculator = () => {
    const displayValue = useAppSelector(state => state.displayValue);
    const dispatch = useAppDispatch();

    const inputButtons = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.'];
    return (
        <StyledWrapper>
            <DisplayArea type="text" value={displayValue} readOnly/>
            <OperationArea>
                {inputButtons.map(item =>
                    <NumberButton onClick={() => dispatch(inputNumber(item))}>{item}</NumberButton>)
                }
            </OperationArea>
        </StyledWrapper>
    )
}
export default Calculator;