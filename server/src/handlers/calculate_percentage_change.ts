
import { type PercentageChangeInput, type CalculationResult } from '../schema';

export async function calculatePercentageChange(input: PercentageChangeInput): Promise<CalculationResult> {
    // This handler calculates "Percentage increase/decrease from X to Y?"
    // Formula: ((newValue - originalValue) / originalValue) * 100
    const result = ((input.newValue - input.originalValue) / input.originalValue) * 100;
    
    const changeType = result >= 0 ? 'increase' : 'decrease';
    const absoluteResult = Math.abs(result);
    
    return {
        result,
        calculationType: 'percentage_change',
        inputs: {
            originalValue: input.originalValue,
            newValue: input.newValue
        },
        formattedResult: `${changeType === 'increase' ? 'Increase' : 'Decrease'} of ${absoluteResult.toFixed(2)}% from ${input.originalValue} to ${input.newValue}`
    };
}
