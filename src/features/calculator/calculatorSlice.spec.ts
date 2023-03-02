import calculatorSlice, {CalculatorState, inputNumber, plus, calculate} from "./calculatorSlice";

describe('calculator reducer', () => {
    let initialState: CalculatorState
    beforeEach(() => {
        initialState = {
            displayValue: '0',
            operator: '',
            savedValue: '0'
        }
    })
    describe('input and display', () => {
        it('should handle input number', () => {
            let actual = calculatorSlice.reducer(initialState, inputNumber('1'))
            expect(actual.displayValue).toEqual('1')

            actual = calculatorSlice.reducer(actual, inputNumber('2'))
            expect(actual.displayValue).toEqual('12')
        });

        it('should separate every three digits by a comma', () => {
            initialState.displayValue = '123'
            let actual = calculatorSlice.reducer(initialState, inputNumber('4'))
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
            initialState.displayValue = '123,456,789'
            let actual = calculatorSlice.reducer(initialState, inputNumber('0'))
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

            initialState.displayValue = '12,345,678'
            actual = calculatorSlice.reducer(initialState, inputNumber('.'))
            expect(actual.displayValue).toEqual('12,345,678.')
            actual = calculatorSlice.reducer(actual, inputNumber('9'))
            expect(actual.displayValue).toEqual('12,345,678.9')
            actual = calculatorSlice.reducer(actual, inputNumber('9'))
            expect(actual.displayValue).toEqual('12,345,678.9')

            initialState.displayValue = '0.'
            actual = calculatorSlice.reducer(initialState, inputNumber('0'))
            expect(actual.displayValue).toEqual('0.0')
            actual = calculatorSlice.reducer(actual, inputNumber('0'))
            expect(actual.displayValue).toEqual('0.00')
            actual = calculatorSlice.reducer(actual, inputNumber('1'))
            expect(actual.displayValue).toEqual('0.001')
            actual = calculatorSlice.reducer(actual, inputNumber('0'))
            expect(actual.displayValue).toEqual('0.0010')
        });
    })
})