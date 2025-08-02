
import { serial, text, pgTable, timestamp, numeric } from 'drizzle-orm/pg-core';

// Optional: Store calculation history (if needed in the future)
export const calculationHistoryTable = pgTable('calculation_history', {
  id: serial('id').primaryKey(),
  calculation_type: text('calculation_type').notNull(),
  inputs: text('inputs').notNull(), // JSON string of inputs
  result: numeric('result', { precision: 15, scale: 6 }).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// TypeScript type for the table schema
export type CalculationHistory = typeof calculationHistoryTable.$inferSelect;
export type NewCalculationHistory = typeof calculationHistoryTable.$inferInsert;

// Export all tables for proper query building
export const tables = { calculationHistory: calculationHistoryTable };
