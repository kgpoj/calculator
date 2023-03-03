import calculatorSlice, {CalculatorState, inputNumber, plus, calculate} from "./calculatorSlice";

describe('calculator reducer', () => {
    let initialState: CalculatorState
    const customInitialState = (displayValue: string): void => {
        initialState.displayValue = displayValue
        initialState.isFirstNumber = false
    }
    beforeEach(() => {
        initialState = {
            displayValue: '0',
            operator: '',
            savedValue: '0',
            lastOperation: '',
            lastKey: '',
            isFirstNumber: true
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
            customInitialState('123')
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
            customInitialState('123,456,789')
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

            customInitialState('12,345,678')
            actual = calculatorSlice.reducer(initialState, inputNumber('.'))
            expect(actual.displayValue).toEqual('12,345,678.')
            actual = calculatorSlice.reducer(actual, inputNumber('9'))
            expect(actual.displayValue).toEqual('12,345,678.9')
            actual = calculatorSlice.reducer(actual, inputNumber('9'))
            expect(actual.displayValue).toEqual('12,345,678.9')

            customInitialState('0.')
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

    describe('perform plus', () => {
        it('should perform plus with integers', () => {
            let actual = calculatorSlice.reducer(initialState, plus())
            actual = calculatorSlice.reducer(actual, inputNumber('1'))
            expect(actual.displayValue).toEqual('1')
            actual = calculatorSlice.reducer(actual, calculate())
            expect(actual.displayValue).toEqual('1')
            actual = calculatorSlice.reducer(actual, plus())
            actual = calculatorSlice.reducer(actual, inputNumber('1'))
            expect(actual.displayValue).toEqual('1')
            actual = calculatorSlice.reducer(actual, calculate())
            expect(actual.displayValue).toEqual('2')

            customInitialState('999')
            actual = calculatorSlice.reducer(initialState, plus())
            actual = calculatorSlice.reducer(actual, inputNumber('1'))
            expect(actual.displayValue).toEqual('1')
            actual = calculatorSlice.reducer(actual, calculate())
            expect(actual.displayValue).toEqual('1,000')

            customInitialState('999,999,999')
            actual = calculatorSlice.reducer(initialState, plus())
            actual = calculatorSlice.reducer(actual, inputNumber('1'))
            expect(actual.displayValue).toEqual('1')
            actual = calculatorSlice.reducer(actual, calculate())
            expect(actual.displayValue).toEqual('1e9')
        });

        it('should perform plus with float numbers', () => {
            let actual = calculatorSlice.reducer(initialState, plus())
            actual = calculatorSlice.reducer(actual, inputNumber('.'))
            actual = calculatorSlice.reducer(actual, inputNumber('1'))
            expect(actual.displayValue).toEqual('0.1')
            actual = calculatorSlice.reducer(actual, calculate())
            expect(actual.displayValue).toEqual('0.1')

            actual = calculatorSlice.reducer(actual, plus())
            actual = calculatorSlice.reducer(actual, inputNumber('0'))
            actual = calculatorSlice.reducer(actual, inputNumber('.'))
            actual = calculatorSlice.reducer(actual, inputNumber('9'))
            expect(actual.displayValue).toEqual('0.9')
            actual = calculatorSlice.reducer(actual, calculate())
            expect(actual.displayValue).toEqual('1')
        });

        it('should perform continuous when click `+` and input number', () => {
            let actual = calculatorSlice.reducer(initialState, plus())
            actual = calculatorSlice.reducer(actual, inputNumber('1'))
            expect(actual.displayValue).toEqual('1')
            actual = calculatorSlice.reducer(actual, plus())
            actual = calculatorSlice.reducer(actual, inputNumber('2'))
            expect(actual.displayValue).toEqual('2')
            actual = calculatorSlice.reducer(actual, plus())
            expect(actual.displayValue).toEqual('3')
            actual = calculatorSlice.reducer(actual, inputNumber('3'))
            actual = calculatorSlice.reducer(actual, plus())
            expect(actual.displayValue).toEqual('6')
            actual = calculatorSlice.reducer(actual, inputNumber('4'))
            actual = calculatorSlice.reducer(actual, calculate())
            expect(actual.displayValue).toEqual('10')

            actual = calculatorSlice.reducer(actual, plus())
            expect(actual.displayValue).toEqual('10')
            actual = calculatorSlice.reducer(actual, plus())
            expect(actual.displayValue).toEqual('10')
            actual = calculatorSlice.reducer(actual, plus())
            expect(actual.displayValue).toEqual('10')

        });

        it('should perform continuous when click `=`', () => {
            let actual = calculatorSlice.reducer(initialState, calculate())
            expect(actual.displayValue).toEqual('0')
            actual = calculatorSlice.reducer(actual, plus())
            actual = calculatorSlice.reducer(actual, inputNumber('2'))
            expect(actual.displayValue).toEqual('2')
            actual = calculatorSlice.reducer(actual, calculate())
            expect(actual.displayValue).toEqual('2')
            actual = calculatorSlice.reducer(actual, calculate())
            expect(actual.displayValue).toEqual('4')
            actual = calculatorSlice.reducer(actual, calculate())
            expect(actual.displayValue).toEqual('6')
            actual = calculatorSlice.reducer(actual, calculate())
            expect(actual.displayValue).toEqual('8')
        });
    })
})