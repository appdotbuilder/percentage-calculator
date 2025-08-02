
import { type PercentageOfNumberInput, type CalculationResult } from '../schema';

export async function calculatePercentageOfNumber(input: PercentageOfNumberInput): Promise<CalculationResult> {
    // This handler calculates "What is X% of Y?"
    // Formula: (percentage / 100) * number
    const result = (input.percentage / 100) * input.number;
    
    return {
        result,
        calculationType: 'percentage_of_number',
        inputs: {
            percentage: input.percentage,
            number: input.number
        },
        formattedResult: `${input.percentage}% of ${input.number} is ${result.toFixed(2)}`
    };
}
