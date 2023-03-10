import { AnyAction } from '@reduxjs/toolkit';
import calculatorSlice, {
  CalculatorState,
  inputNumber,
  plus,
  minus,
  calculate,
  multiply,
  divide, percentage, switchSign, clearCurrent,
} from './calculatorSlice';

const performActions = (
  initialState: CalculatorState,
  ...actions: AnyAction[]
): CalculatorState => actions.reduce(
  (pre: CalculatorState, cur: AnyAction) => calculatorSlice.reducer(pre, cur),
  initialState,
);
describe('calculator reducer', () => {
  let initialState: CalculatorState;
  const customInitialState = (displayValue: string): void => {
    initialState.displayValue = displayValue;
    initialState.isFirstNumber = false;
    initialState.expression = displayValue;
  };

  beforeEach(() => {
    initialState = {
      displayValue: '0',
      prevOperator: '',
      expression: '',
      prevOperation: '',
      prevKey: '',
      test: '',
      isFirstNumber: true,
    };
  });
  describe('input and display', () => {
    it('should handle input number', () => {
      let actual = calculatorSlice.reducer(initialState, inputNumber('1'));
      expect(actual.displayValue).toEqual('1');

      actual = calculatorSlice.reducer(actual, inputNumber('2'));
      expect(actual.displayValue).toEqual('12');
    });

    it('should handle input dot', () => {
      let actual = calculatorSlice.reducer(initialState, inputNumber('.'));
      expect(actual.displayValue).toEqual('0.');

      actual = calculatorSlice.reducer(actual, inputNumber('.'));
      expect(actual.displayValue).toEqual('0.');
      actual = calculatorSlice.reducer(actual, inputNumber('1'));
      expect(actual.displayValue).toEqual('0.1');
      actual = calculatorSlice.reducer(actual, inputNumber('.'));
      expect(actual.displayValue).toEqual('0.1');

      actual = calculatorSlice.reducer(actual, inputNumber('2'));
      expect(actual.displayValue).toEqual('0.12');
      actual = calculatorSlice.reducer(actual, inputNumber('3'));
      expect(actual.displayValue).toEqual('0.123');
      actual = calculatorSlice.reducer(actual, inputNumber('4'));
      expect(actual.displayValue).toEqual('0.1234');
      actual = calculatorSlice.reducer(actual, inputNumber('5'));
      expect(actual.displayValue).toEqual('0.12345');
      actual = calculatorSlice.reducer(actual, inputNumber('6'));
      expect(actual.displayValue).toEqual('0.123456');
      actual = calculatorSlice.reducer(actual, inputNumber('7'));
      expect(actual.displayValue).toEqual('0.1234567');
      actual = calculatorSlice.reducer(actual, inputNumber('8'));
      expect(actual.displayValue).toEqual('0.12345678');
      actual = calculatorSlice.reducer(actual, inputNumber('9'));
      expect(actual.displayValue).toEqual('0.12345678');

      customInitialState('12,345,678');
      actual = calculatorSlice.reducer(initialState, inputNumber('.'));
      expect(actual.displayValue).toEqual('12,345,678.');
      actual = calculatorSlice.reducer(actual, inputNumber('9'));
      expect(actual.displayValue).toEqual('12,345,678.9');
      actual = calculatorSlice.reducer(actual, inputNumber('9'));
      expect(actual.displayValue).toEqual('12,345,678.9');

      customInitialState('0.');
      actual = calculatorSlice.reducer(initialState, inputNumber('0'));
      expect(actual.displayValue).toEqual('0.0');
      actual = calculatorSlice.reducer(actual, inputNumber('0'));
      expect(actual.displayValue).toEqual('0.00');
      actual = calculatorSlice.reducer(actual, inputNumber('1'));
      expect(actual.displayValue).toEqual('0.001');
      actual = calculatorSlice.reducer(actual, inputNumber('0'));
      expect(actual.displayValue).toEqual('0.0010');
    });
  });

  describe('perform plus', () => {
    it('should perform plus with integers', () => {
      let actual = calculatorSlice.reducer(initialState, plus());
      actual = calculatorSlice.reducer(actual, inputNumber('1'));
      expect(actual.displayValue).toEqual('1');
      actual = calculatorSlice.reducer(actual, calculate());
      expect(actual.displayValue).toEqual('1');
      actual = calculatorSlice.reducer(actual, plus());
      actual = calculatorSlice.reducer(actual, inputNumber('1'));
      expect(actual.displayValue).toEqual('1');
      actual = calculatorSlice.reducer(actual, calculate());
      expect(actual.displayValue).toEqual('2');
    });

    it('should perform plus with float numbers', () => {
      let actual = calculatorSlice.reducer(initialState, plus());
      actual = calculatorSlice.reducer(actual, inputNumber('.'));
      actual = calculatorSlice.reducer(actual, inputNumber('1'));
      expect(actual.displayValue).toEqual('0.1');
      actual = calculatorSlice.reducer(actual, calculate());
      expect(actual.displayValue).toEqual('0.1');

      actual = calculatorSlice.reducer(actual, plus());
      actual = calculatorSlice.reducer(actual, inputNumber('0'));
      actual = calculatorSlice.reducer(actual, inputNumber('.'));
      actual = calculatorSlice.reducer(actual, inputNumber('9'));
      expect(actual.displayValue).toEqual('0.9');
      actual = calculatorSlice.reducer(actual, calculate());
      expect(actual.displayValue).toEqual('1');
    });

    it('should perform continuous when click `+` and input number', () => {
      let actual = calculatorSlice.reducer(initialState, plus());
      actual = calculatorSlice.reducer(actual, inputNumber('1'));
      expect(actual.displayValue).toEqual('1');
      actual = calculatorSlice.reducer(actual, plus());
      actual = calculatorSlice.reducer(actual, inputNumber('2'));
      expect(actual.displayValue).toEqual('2');
      actual = calculatorSlice.reducer(actual, plus());
      expect(actual.displayValue).toEqual('3');
      actual = calculatorSlice.reducer(actual, inputNumber('3'));
      actual = calculatorSlice.reducer(actual, plus());
      expect(actual.displayValue).toEqual('6');
      actual = calculatorSlice.reducer(actual, inputNumber('4'));
      actual = calculatorSlice.reducer(actual, calculate());
      expect(actual.displayValue).toEqual('10');

      actual = calculatorSlice.reducer(actual, plus());
      expect(actual.displayValue).toEqual('10');
      actual = calculatorSlice.reducer(actual, plus());
      expect(actual.displayValue).toEqual('10');
      actual = calculatorSlice.reducer(actual, plus());
      expect(actual.displayValue).toEqual('10');
    });

    it('should perform continuous when click `=`', () => {
      let actual = calculatorSlice.reducer(initialState, calculate());
      expect(actual.displayValue).toEqual('0');
      actual = calculatorSlice.reducer(actual, plus());
      actual = calculatorSlice.reducer(actual, inputNumber('2'));
      expect(actual.displayValue).toEqual('2');
      actual = calculatorSlice.reducer(actual, calculate());
      expect(actual.displayValue).toEqual('2');
      actual = calculatorSlice.reducer(actual, calculate());
      expect(actual.displayValue).toEqual('4');
      actual = calculatorSlice.reducer(actual, calculate());
      expect(actual.displayValue).toEqual('6');
      actual = calculatorSlice.reducer(actual, calculate());
      expect(actual.displayValue).toEqual('8');
    });
  });

  describe('perform minus', () => {
    describe('minus on integer', () => {
      it('should perform basic minus on integer', () => {
        customInitialState('3');

        const result = performActions(initialState, minus(), inputNumber('1'), calculate());

        expect(result.displayValue).toEqual('2');
      });

      it('should result in negative integer number', () => {
        customInitialState('3');

        const result = performActions(initialState, minus(), inputNumber('4'), calculate());

        expect(result.displayValue).toEqual('-1');
      });
    });

    describe('minus on float number', () => {
      it('should perform basic minus on float number', () => {
        customInitialState('3.1');

        const result = performActions(initialState, minus(), inputNumber('1.2'), calculate());

        expect(Number(result.displayValue)).toBeCloseTo(1.9);
      });

      it('should result in negative float number', () => {
        customInitialState('3.1');

        const result = performActions(initialState, minus(), inputNumber('4.2'), calculate());

        expect(Number(result.displayValue)).toBeCloseTo(-1.1);
      });
    });

    describe('continuous minus', () => {
      it('should perform continuous minus when click `-`', () => {
        customInitialState('5');

        const result = performActions(initialState, minus(), inputNumber('2'), minus());

        expect(result.displayValue).toEqual('3');
      });

      it('should get correct result after continuous minus by click `-`', () => {
        customInitialState('5');

        const result = performActions(initialState, minus(), inputNumber('2'), minus(), inputNumber('2'), calculate());

        expect(result.displayValue).toEqual('1');
      });

      it('should result in 0 when consecutively click `-` and `=`', () => {
        customInitialState('1234');

        const result = performActions(initialState, minus(), calculate());

        expect(result.displayValue).toEqual('0');
      });

      it('should perform continuous minus when click `=`', () => {
        customInitialState('5');

        const result = performActions(initialState, minus(), inputNumber('3'), calculate(), calculate(), calculate());

        expect(result.displayValue).toEqual('-4');
      });
    });
  });

  describe('perform multiply', () => {
    describe('multiply on integer', () => {
      it('should perform multiply on integer', () => {
        customInitialState('3');

        const result = performActions(initialState, multiply(), inputNumber('2'), calculate());

        expect(result.displayValue).toEqual('6');
      });

      it('should perform multiply on large numbers', () => {
        customInitialState('999999999');

        const result = performActions(initialState, multiply(), inputNumber('999999999'), calculate());

        expect(result.displayValue).toEqual('999999998000000000');
      });
    });

    describe('multiply on float number', () => {
      it('should perform basic multiply on float number', () => {
        customInitialState('3.1');

        const result = performActions(initialState, multiply(), inputNumber('1.2'), calculate());

        expect(Number(result.displayValue)).toBeCloseTo(3.72);
      });

      it('should perform multiply on little numbers', () => {
        customInitialState('0.00000001');

        const result = performActions(initialState, multiply(), inputNumber('0.00000001'), calculate());

        expect(Number(result.displayValue)).toBeCloseTo(1e-16);
      });
    });

    describe('continuous multiply', () => {
      it('should perform continuous multiply when click `??`', () => {
        customInitialState('5');

        const result = performActions(initialState, multiply(), inputNumber('2'), multiply());

        expect(result.displayValue).toEqual('10');
      });

      it('should get correct result after continuous multiply by click `??`', () => {
        customInitialState('5');

        const result = performActions(initialState, multiply(), inputNumber('2'), multiply(), inputNumber('2'), calculate());

        expect(result.displayValue).toEqual('20');
      });

      it('should multiplied by self when consecutively click `??` and `=`', () => {
        customInitialState('10');

        const result = performActions(initialState, multiply(), calculate());

        expect(result.displayValue).toEqual('100');
      });

      it('should perform continuous multiply when click `=`', () => {
        customInitialState('5');

        const result = performActions(initialState, multiply(), inputNumber('2'), calculate(), calculate(), calculate());

        expect(result.displayValue).toEqual('40');
      });
    });
  });

  describe('perform divide', () => {
    describe('divide on integer', () => {
      it('should perform basic divide on integer', () => {
        customInitialState('6');

        const result = performActions(initialState, divide(), inputNumber('2'), calculate());

        expect(result.displayValue).toEqual('3');
      });

      it('should result in float number', () => {
        customInitialState('2');

        const result = performActions(initialState, divide(), inputNumber('3'), calculate());

        expect(Number(result.displayValue)).toBeCloseTo(0.66666667);
      });
    });

    describe('divide on float number', () => {
      it('should perform basic divide on float number', () => {
        customInitialState('0.12');

        const result = performActions(initialState, divide(), inputNumber('0.3'), calculate());

        expect(Number(result.displayValue)).toBeCloseTo(0.4);
      });

      it('should perform divide on little numbers', () => {
        customInitialState('0.00000001');

        const result = performActions(initialState, divide(), inputNumber('3'), calculate());

        expect(Number(result.displayValue)).toBeCloseTo(3.333e-9);
      });
    });

    describe('continuous divide', () => {
      it('should perform continuous divide when click `??`', () => {
        customInitialState('10');

        const result = performActions(initialState, divide(), inputNumber('2'), divide());

        expect(result.displayValue).toEqual('5');
      });

      it('should get correct result after continuous divide by click `??`', () => {
        customInitialState('10');

        const result = performActions(initialState, divide(), inputNumber('2'), divide(), inputNumber('5'), calculate());

        expect(result.displayValue).toEqual('1');
      });

      it('should divided by self when consecutively click `??` and `=`', () => {
        customInitialState('10');

        const result = performActions(initialState, divide(), calculate());

        expect(result.displayValue).toEqual('1');
      });

      it('should perform continuous divide when click `=`', () => {
        customInitialState('40');

        const result = performActions(initialState, divide(), inputNumber('2'), calculate(), calculate(), calculate());

        expect(result.displayValue).toEqual('5');
      });
    });
  });

  describe('perform multiple operations', () => {
    it('should be executed in the correct order', () => {
      customInitialState('1');

      const result = performActions(initialState, plus(), inputNumber('2'), multiply(), inputNumber('3'), calculate());

      expect(result.displayValue).toEqual('7');
    });

    it('should display previous value', () => {
      customInitialState('1');

      const result = performActions(initialState, plus(), inputNumber('2'), plus(), multiply());

      expect(result.displayValue).toEqual('2');
    });

    it('should display plus result', () => {
      customInitialState('1');

      const result = performActions(initialState, plus(), inputNumber('2'), multiply(), plus());

      expect(result.displayValue).toEqual('3');
    });
  });

  describe('perform percentage', () => {
    it('should get correct display value after percentage', () => {
      customInitialState('99');

      const result = performActions(initialState, percentage());

      expect(result.displayValue).toEqual('0.99');
    });

    it('should get correct result after calculation on percentage value', () => {
      customInitialState('99');

      const result = performActions(initialState, percentage(), plus(), inputNumber('1'), calculate());

      expect(result.displayValue).toEqual('1.99');
    });

    it('should handle click operator and percentage', () => {
      customInitialState('2');

      const result = performActions(initialState, plus(), percentage(), calculate());

      expect(result.displayValue).toEqual('2.04');
    });
  });

  describe('perform switch between negative and positive', () => {
    it('should get correct display value after switch', () => {
      customInitialState('99');

      const result = performActions(initialState, switchSign());

      expect(result.displayValue).toEqual('-99');
    });

    it('should get correct result after calculation on value switched sign', () => {
      customInitialState('99');

      const result = performActions(initialState, switchSign(), plus(), inputNumber('1'), calculate());

      expect(result.displayValue).toEqual('-98');
    });

    describe('handle click operator and switch sign', () => {
      it('should display `-0` after click operator and switch sign', () => {
        customInitialState('2');

        const result = performActions(initialState, plus(), switchSign());

        expect(result.displayValue).toEqual('-0');
      });

      it('should correctly input negative numbers', () => {
        customInitialState('2');

        const result = performActions(initialState, plus(), switchSign(), inputNumber('3'));

        expect(result.displayValue).toEqual('-3');
      });

      it('should get correct result after calculation on negative numbers', () => {
        customInitialState('2');

        const result = performActions(initialState, minus(), switchSign(), inputNumber('3'), calculate());

        expect(result.displayValue).toEqual('5');
      });
    });
  });

  describe('clear current display value', () => {
    it('should display `0` after click `C`', () => {
      customInitialState('2');

      const result = performActions(initialState, clearCurrent());

      expect(result.displayValue).toEqual('0');
    });
  });

  describe('handle error', () => {
    it('should show `ERROR` when divided by 0', () => {
      customInitialState('92');

      const result = performActions(initialState, divide(), inputNumber('0'), calculate());

      expect(result.displayValue).toEqual('ERROR');
    });

    it('should be able to calculate after error', () => {
      customInitialState('92');

      const result = performActions(initialState, divide(), inputNumber('0'), calculate(), inputNumber('1'), plus(), inputNumber('1'), calculate());

      expect(result.displayValue).toEqual('2');
    });

    it('should handle click operator after error', () => {
      customInitialState('92');

      const result = performActions(initialState, divide(), inputNumber('0'), calculate(), plus(), inputNumber('1'), calculate());

      expect(result.displayValue).toEqual('ERROR');
    });
  });
});
