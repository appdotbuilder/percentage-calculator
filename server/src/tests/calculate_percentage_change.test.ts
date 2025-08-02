
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { type PercentageChangeInput } from '../schema';
import { calculatePercentageChange } from '../handlers/calculate_percentage_change';

describe('calculatePercentageChange', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should calculate percentage increase correctly', async () => {
    const input: PercentageChangeInput = {
      originalValue: 100,
      newValue: 150
    };

    const result = await calculatePercentageChange(input);

    expect(result.result).toEqual(50);
    expect(result.calculationType).toEqual('percentage_change');
    expect(result.inputs['originalValue']).toEqual(100);
    expect(result.inputs['newValue']).toEqual(150);
    expect(result.formattedResult).toEqual('Increase of 50.00% from 100 to 150');
  });

  it('should calculate percentage decrease correctly', async () => {
    const input: PercentageChangeInput = {
      originalValue: 200,
      newValue: 150
    };

    const result = await calculatePercentageChange(input);

    expect(result.result).toEqual(-25);
    expect(result.calculationType).toEqual('percentage_change');
    expect(result.inputs['originalValue']).toEqual(200);
    expect(result.inputs['newValue']).toEqual(150);
    expect(result.formattedResult).toEqual('Decrease of 25.00% from 200 to 150');
  });

  it('should handle zero change (same values)', async () => {
    const input: PercentageChangeInput = {
      originalValue: 100,
      newValue: 100
    };

    const result = await calculatePercentageChange(input);

    expect(result.result).toEqual(0);
    expect(result.calculationType).toEqual('percentage_change');
    expect(result.inputs['originalValue']).toEqual(100);
    expect(result.inputs['newValue']).toEqual(100);
    expect(result.formattedResult).toEqual('Increase of 0.00% from 100 to 100');
  });

  it('should handle decimal values correctly', async () => {
    const input: PercentageChangeInput = {
      originalValue: 33.33,
      newValue: 66.66
    };

    const result = await calculatePercentageChange(input);

    expect(result.result).toBeCloseTo(100, 0); // Allow for floating point precision, expect ~100%
    expect(result.calculationType).toEqual('percentage_change');
    expect(result.inputs['originalValue']).toEqual(33.33);
    expect(result.inputs['newValue']).toEqual(66.66);
    expect(result.formattedResult).toContain('Increase of 100.00%');
  });

  it('should handle negative original values correctly', async () => {
    const input: PercentageChangeInput = {
      originalValue: -50,
      newValue: -25
    };

    const result = await calculatePercentageChange(input);

    expect(result.result).toEqual(-50); // From -50 to -25 is a 50% decrease (moving toward zero)
    expect(result.calculationType).toEqual('percentage_change');
    expect(result.inputs['originalValue']).toEqual(-50);
    expect(result.inputs['newValue']).toEqual(-25);
    expect(result.formattedResult).toEqual('Decrease of 50.00% from -50 to -25');
  });

  it('should handle crossing zero (negative to positive)', async () => {
    const input: PercentageChangeInput = {
      originalValue: -50,
      newValue: 50
    };

    const result = await calculatePercentageChange(input);

    expect(result.result).toEqual(-200); // From -50 to 50 is a 200% decrease (in terms of the formula)
    expect(result.calculationType).toEqual('percentage_change');
    expect(result.inputs['originalValue']).toEqual(-50);
    expect(result.inputs['newValue']).toEqual(50);
    expect(result.formattedResult).toEqual('Decrease of 200.00% from -50 to 50');
  });

  it('should handle very small percentage changes', async () => {
    const input: PercentageChangeInput = {
      originalValue: 1000,
      newValue: 1001
    };

    const result = await calculatePercentageChange(input);

    expect(result.result).toEqual(0.1);
    expect(result.calculationType).toEqual('percentage_change');
    expect(result.inputs['originalValue']).toEqual(1000);
    expect(result.inputs['newValue']).toEqual(1001);
    expect(result.formattedResult).toEqual('Increase of 0.10% from 1000 to 1001');
  });

  it('should handle large percentage changes', async () => {
    const input: PercentageChangeInput = {
      originalValue: 1,
      newValue: 1000
    };

    const result = await calculatePercentageChange(input);

    expect(result.result).toEqual(99900);
    expect(result.calculationType).toEqual('percentage_change');
    expect(result.inputs['originalValue']).toEqual(1);
    expect(result.inputs['newValue']).toEqual(1000);
    expect(result.formattedResult).toEqual('Increase of 99900.00% from 1 to 1000');
  });

  it('should format results to 2 decimal places', async () => {
    const input: PercentageChangeInput = {
      originalValue: 3,
      newValue: 10
    };

    const result = await calculatePercentageChange(input);

    expect(result.result).toBeCloseTo(233.33, 2);
    expect(result.formattedResult).toContain('233.33%');
  });
});
