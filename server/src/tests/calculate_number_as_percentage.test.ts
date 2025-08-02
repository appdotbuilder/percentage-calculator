
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { type NumberAsPercentageInput } from '../schema';
import { calculateNumberAsPercentage } from '../handlers/calculate_number_as_percentage';

describe('calculateNumberAsPercentage', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should calculate basic percentage correctly', async () => {
    const input: NumberAsPercentageInput = {
      numerator: 25,
      denominator: 100
    };

    const result = await calculateNumberAsPercentage(input);

    expect(result.result).toEqual(25);
    expect(result.calculationType).toEqual('number_as_percentage');
    expect(result.inputs['numerator']).toEqual(25);
    expect(result.inputs['denominator']).toEqual(100);
    expect(result.formattedResult).toEqual('25 is 25.00% of 100');
  });

  it('should handle decimal numerator', async () => {
    const input: NumberAsPercentageInput = {
      numerator: 12.5,
      denominator: 50
    };

    const result = await calculateNumberAsPercentage(input);

    expect(result.result).toEqual(25);
    expect(result.formattedResult).toEqual('12.5 is 25.00% of 50');
  });

  it('should handle decimal denominator', async () => {
    const input: NumberAsPercentageInput = {
      numerator: 15,
      denominator: 37.5
    };

    const result = await calculateNumberAsPercentage(input);

    expect(result.result).toEqual(40);
    expect(result.formattedResult).toEqual('15 is 40.00% of 37.5');
  });

  it('should handle numerator greater than denominator', async () => {
    const input: NumberAsPercentageInput = {
      numerator: 150,
      denominator: 100
    };

    const result = await calculateNumberAsPercentage(input);

    expect(result.result).toEqual(150);
    expect(result.formattedResult).toEqual('150 is 150.00% of 100');
  });

  it('should handle zero numerator', async () => {
    const input: NumberAsPercentageInput = {
      numerator: 0,
      denominator: 50
    };

    const result = await calculateNumberAsPercentage(input);

    expect(result.result).toEqual(0);
    expect(result.formattedResult).toEqual('0 is 0.00% of 50');
  });

  it('should handle negative numerator', async () => {
    const input: NumberAsPercentageInput = {
      numerator: -25,
      denominator: 100
    };

    const result = await calculateNumberAsPercentage(input);

    expect(result.result).toEqual(-25);
    expect(result.formattedResult).toEqual('-25 is -25.00% of 100');
  });

  it('should handle negative denominator', async () => {
    const input: NumberAsPercentageInput = {
      numerator: 30,
      denominator: -100
    };

    const result = await calculateNumberAsPercentage(input);

    expect(result.result).toEqual(-30);
    expect(result.formattedResult).toEqual('30 is -30.00% of -100');
  });

  it('should handle very small numbers with precision', async () => {
    const input: NumberAsPercentageInput = {
      numerator: 1,
      denominator: 3
    };

    const result = await calculateNumberAsPercentage(input);

    expect(result.result).toBeCloseTo(33.333333, 5);
    expect(result.formattedResult).toEqual('1 is 33.33% of 3');
  });
});
