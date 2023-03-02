import calculatorSlice, {CalculatorState, inputNumber} from "./calculatorSlice";

describe('calculator reducer', () => {
    const initialState: CalculatorState = {
        displayValue: '0'
    }
    it('should handle input number', () => {
        let actual = calculatorSlice.reducer(initialState, inputNumber('1'))
        expect(actual.displayValue).toEqual('1')

        actual = calculatorSlice.reducer(actual, inputNumber('2'))
        expect(actual.displayValue).toEqual('12')
    });

    it('should separate every three digits by a comma', () => {
        let actual = calculatorSlice.reducer({displayValue: '123'}, inputNumber('4'))
        expect(actual.displayValue).toEqual('1,234')

        actual = calculatorSlice.reducer(actual, inputNumber('5'))
        expect(actual.displayValue).toEqual('12,345')
        actual = calculatorSlice.reducer(actual, inputNumber('6'))
        expect(actual.displayValue).toEqual('123,456')
        actual = calculatorSlice.reducer(actual, inputNumber('7'))
        expect(actual.displayValue).toEqual('1,234,567')
        actual = calculatorSlice.reducer(actual, inputNumber('8'))
        expect(actual.displayValue).toEqual('12,345,678')
        actual = calculatorSlice.reducer(actual, inputNumber('9'))
        expect(actual.displayValue).toEqual('123,456,789')
    });

    it('should limit the maximum number of digits to 9', () => {
        let actual = calculatorSlice.reducer({displayValue: '123,456,789'}, inputNumber('0'))
        expect(actual.displayValue).toEqual('123,456,789')
    });

    it('should handle input dot', () => {
        let actual = calculatorSlice.reducer(initialState, inputNumber('.'))
        expect(actual.displayValue).toEqual('0.')

        actual = calculatorSlice.reducer(actual, inputNumber('.'))
        expect(actual.displayValue).toEqual('0.')
        actual = calculatorSlice.reducer(actual, inputNumber('1'))
        expect(actual.displayValue).toEqual('0.1')
        actual = calculatorSlice.reducer(actual, inputNumber('.'))
        expect(actual.displayValue).toEqual('0.1')

        actual = calculatorSlice.reducer(actual, inputNumber('2'))
        expect(actual.displayValue).toEqual('0.12')
        actual = calculatorSlice.reducer(actual, inputNumber('3'))
        expect(actual.displayValue).toEqual('0.123')
        actual = calculatorSlice.reducer(actual, inputNumber('4'))
        expect(actual.displayValue).toEqual('0.1234')
        actual = calculatorSlice.reducer(actual, inputNumber('5'))
        expect(actual.displayValue).toEqual('0.12345')
        actual = calculatorSlice.reducer(actual, inputNumber('6'))
        expect(actual.displayValue).toEqual('0.123456')
        actual = calculatorSlice.reducer(actual, inputNumber('7'))
        expect(actual.displayValue).toEqual('0.1234567')
        actual = calculatorSlice.reducer(actual, inputNumber('8'))
        expect(actual.displayValue).toEqual('0.12345678')
        actual = calculatorSlice.reducer(actual, inputNumber('9'))
        expect(actual.displayValue).toEqual('0.12345678')

        actual = calculatorSlice.reducer({displayValue: '12,345,678'}, inputNumber('.'))
        expect(actual.displayValue).toEqual('12,345,678.')
        actual = calculatorSlice.reducer(actual, inputNumber('9'))
        expect(actual.displayValue).toEqual('12,345,678.9')
        actual = calculatorSlice.reducer(actual, inputNumber('9'))
        expect(actual.displayValue).toEqual('12,345,678.9')

        actual = calculatorSlice.reducer({displayValue: '0.'}, inputNumber('0'))
        expect(actual.displayValue).toEqual('0.0')
        actual = calculatorSlice.reducer(actual, inputNumber('0'))
        expect(actual.displayValue).toEqual('0.00')
        actual = calculatorSlice.reducer(actual, inputNumber('1'))
        expect(actual.displayValue).toEqual('0.001')
        actual = calculatorSlice.reducer(actual, inputNumber('0'))
        expect(actual.displayValue).toEqual('0.0010')
    });
})