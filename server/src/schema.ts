
import { z } from 'zod';

// Schema for "What is X% of Y?" calculation
export const percentageOfNumberSchema = z.object({
  percentage: z.number(),
  number: z.number()
});

export type PercentageOfNumberInput = z.infer<typeof percentageOfNumberSchema>;

// Schema for "X is what percentage of Y?" calculation
export const numberAsPercentageSchema = z.object({
  numerator: z.number(),
  denominator: z.number().refine(val => val !== 0, {
    message: "Denominator cannot be zero"
  })
});

export type NumberAsPercentageInput = z.infer<typeof numberAsPercentageSchema>;

// Schema for "Percentage increase/decrease from X to Y?" calculation
export const percentageChangeSchema = z.object({
  originalValue: z.number().refine(val => val !== 0, {
    message: "Original value cannot be zero"
  }),
  newValue: z.number()
});

export type PercentageChangeInput = z.infer<typeof percentageChangeSchema>;

// Common result schema for all calculations
export const calculationResultSchema = z.object({
  result: z.number(),
  calculationType: z.enum(['percentage_of_number', 'number_as_percentage', 'percentage_change']),
  inputs: z.record(z.number()),
  formattedResult: z.string()
});

export type CalculationResult = z.infer<typeof calculationResultSchema>;
