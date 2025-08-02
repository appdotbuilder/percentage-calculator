
import { type NumberAsPercentageInput, type CalculationResult } from '../schema';

export async function calculateNumberAsPercentage(input: NumberAsPercentageInput): Promise<CalculationResult> {
    // This handler calculates "X is what percentage of Y?"
    // Formula: (numerator / denominator) * 100
    const result = (input.numerator / input.denominator) * 100;
    
    return {
        result,
        calculationType: 'number_as_percentage',
        inputs: {
            numerator: input.numerator,
            denominator: input.denominator
        },
        formattedResult: `${input.numerator} is ${result.toFixed(2)}% of ${input.denominator}`
    };
}
