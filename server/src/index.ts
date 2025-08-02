
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';

import { 
  percentageOfNumberSchema, 
  numberAsPercentageSchema, 
  percentageChangeSchema 
} from './schema';
import { calculatePercentageOfNumber } from './handlers/calculate_percentage_of_number';
import { calculateNumberAsPercentage } from './handlers/calculate_number_as_percentage';
import { calculatePercentageChange } from './handlers/calculate_percentage_change';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),
  
  // Calculate "What is X% of Y?"
  calculatePercentageOfNumber: publicProcedure
    .input(percentageOfNumberSchema)
    .mutation(({ input }) => calculatePercentageOfNumber(input)),
  
  // Calculate "X is what percentage of Y?"
  calculateNumberAsPercentage: publicProcedure
    .input(numberAsPercentageSchema)
    .mutation(({ input }) => calculateNumberAsPercentage(input)),
  
  // Calculate "Percentage increase/decrease from X to Y?"
  calculatePercentageChange: publicProcedure
    .input(percentageChangeSchema)
    .mutation(({ input }) => calculatePercentageChange(input)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC Calculator server listening at port: ${port}`);
}

start();
