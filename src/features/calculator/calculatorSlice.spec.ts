import calculatorSlice, {CalculatorState, inputNumber, plus, minus, calculate} from "./calculatorSlice";

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

    describe('perform minus', () => {
        describe('minus on integer', () => {
            it('should perform basic minus on integer', () => {
                customInitialState('3')

                let actual = calculatorSlice.reducer(initialState, minus())
                actual = calculatorSlice.reducer(actual, inputNumber('1'))
                actual = calculatorSlice.reducer(actual, calculate())

                expect(actual.displayValue).toEqual('2')
            });

            it('should result in negative integer number', () => {
                customInitialState('3')

                let actual = calculatorSlice.reducer(initialState, minus())
                actual = calculatorSlice.reducer(actual, inputNumber('4'))
                actual = calculatorSlice.reducer(actual, calculate())

                expect(actual.displayValue).toEqual('-1')
            });
        })

        describe('minus on float number', () => {
            it('should perform basic minus on float number', () => {
                customInitialState('3.1')

                let actual = calculatorSlice.reducer(initialState, minus())
                actual = calculatorSlice.reducer(actual, inputNumber('1.2'))
                actual = calculatorSlice.reducer(actual, calculate())

                expect(Number(actual.displayValue)).toBeCloseTo(1.9)
            });

            it('should result in negative float number', () => {
                customInitialState('3.1')

                let actual = calculatorSlice.reducer(initialState, minus())
                actual = calculatorSlice.reducer(actual, inputNumber('4.2'))
                actual = calculatorSlice.reducer(actual, calculate())

                expect(Number(actual.displayValue)).toBeCloseTo(-1.1)
            });
        })

        describe('continuous minus', () => {
            it('should perform continuous minus when click `-`', () => {
                customInitialState('5')

                let actual = calculatorSlice.reducer(initialState, minus())
                actual = calculatorSlice.reducer(actual, inputNumber('2'))
                actual = calculatorSlice.reducer(actual, minus())

                expect(actual.displayValue).toEqual('3')
            });

            it('should get correct result after continuous minus by click `-`', () => {
                customInitialState('5')

                let actual = calculatorSlice.reducer(initialState, minus())
                actual = calculatorSlice.reducer(actual, inputNumber('2'))
                actual = calculatorSlice.reducer(actual, minus())
                actual = calculatorSlice.reducer(actual, inputNumber('2'))
                actual = calculatorSlice.reducer(actual, calculate())

                expect(actual.displayValue).toEqual('1')
            });

            it('should result in 0 when consecutively click `-` and `=`', () => {
                customInitialState('1234')

                let actual = calculatorSlice.reducer(initialState, minus())
                actual = calculatorSlice.reducer(actual, calculate())

                expect(actual.displayValue).toEqual('0')
            });

            it('should perform continuous minus when click `=`', () => {
                customInitialState('5')

                let actual = calculatorSlice.reducer(initialState, minus())
                actual = calculatorSlice.reducer(actual, inputNumber('3'))
                actual = calculatorSlice.reducer(actual, calculate())
                actual = calculatorSlice.reducer(actual, calculate())
                actual = calculatorSlice.reducer(actual, calculate())

                expect(actual.displayValue).toEqual('-4')
            });
        })
    })
})