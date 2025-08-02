
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { type PercentageOfNumberInput } from '../schema';
import { calculatePercentageOfNumber } from '../handlers/calculate_percentage_of_number';

describe('calculatePercentageOfNumber', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should calculate basic percentage correctly', async () => {
    const input: PercentageOfNumberInput = {
      percentage: 25,
      number: 100
    };

    const result = await calculatePercentageOfNumber(input);

    expect(result.result).toEqual(25);
    expect(result.calculationType).toEqual('percentage_of_number');
    expect(result.inputs['percentage']).toEqual(25);
    expect(result.inputs['number']).toEqual(100);
    expect(result.formattedResult).toEqual('25% of 100 is 25.00');
  });

  it('should handle decimal percentages', async () => {
    const input: PercentageOfNumberInput = {
      percentage: 12.5,
      number: 80
    };

    const result = await calculatePercentageOfNumber(input);

    expect(result.result).toEqual(10);
    expect(result.calculationType).toEqual('percentage_of_number');
    expect(result.formattedResult).toEqual('12.5% of 80 is 10.00');
  });

  it('should handle decimal numbers', async () => {
    const input: PercentageOfNumberInput = {
      percentage: 15,
      number: 33.33
    };

    const result = await calculatePercentageOfNumber(input);

    expect(result.result).toBeCloseTo(4.9995, 4);
    expect(result.calculationType).toEqual('percentage_of_number');
    expect(result.formattedResult).toEqual('15% of 33.33 is 5.00');
  });

  it('should handle zero percentage', async () => {
    const input: PercentageOfNumberInput = {
      percentage: 0,
      number: 50
    };

    const result = await calculatePercentageOfNumber(input);

    expect(result.result).toEqual(0);
    expect(result.calculationType).toEqual('percentage_of_number');
    expect(result.formattedResult).toEqual('0% of 50 is 0.00');
  });

  it('should handle zero number', async () => {
    const input: PercentageOfNumberInput = {
      percentage: 50,
      number: 0
    };

    const result = await calculatePercentageOfNumber(input);

    expect(result.result).toEqual(0);
    expect(result.calculationType).toEqual('percentage_of_number');
    expect(result.formattedResult).toEqual('50% of 0 is 0.00');
  });

  it('should handle percentage over 100%', async () => {
    const input: PercentageOfNumberInput = {
      percentage: 150,
      number: 20
    };

    const result = await calculatePercentageOfNumber(input);

    expect(result.result).toEqual(30);
    expect(result.calculationType).toEqual('percentage_of_number');
    expect(result.formattedResult).toEqual('150% of 20 is 30.00');
  });

  it('should handle negative percentage', async () => {
    const input: PercentageOfNumberInput = {
      percentage: -25,
      number: 40
    };

    const result = await calculatePercentageOfNumber(input);

    expect(result.result).toEqual(-10);
    expect(result.calculationType).toEqual('percentage_of_number');
    expect(result.formattedResult).toEqual('-25% of 40 is -10.00');
  });

  it('should handle negative number', async () => {
    const input: PercentageOfNumberInput = {
      percentage: 20,
      number: -50
    };

    const result = await calculatePercentageOfNumber(input);

    expect(result.result).toEqual(-10);
    expect(result.calculationType).toEqual('percentage_of_number');
    expect(result.formattedResult).toEqual('20% of -50 is -10.00');
  });

  it('should handle very small numbers with precision', async () => {
    const input: PercentageOfNumberInput = {
      percentage: 0.1,
      number: 1000
    };

    const result = await calculatePercentageOfNumber(input);

    expect(result.result).toEqual(1);
    expect(result.calculationType).toEqual('percentage_of_number');
    expect(result.formattedResult).toEqual('0.1% of 1000 is 1.00');
  });

  it('should format results with proper decimal places', async () => {
    const input: PercentageOfNumberInput = {
      percentage: 33.333,
      number: 99.999
    };

    const result = await calculatePercentageOfNumber(input);

    expect(result.result).toBeCloseTo(33.332666667, 6);
    expect(result.formattedResult).toEqual('33.333% of 99.999 is 33.33');
  });
});
