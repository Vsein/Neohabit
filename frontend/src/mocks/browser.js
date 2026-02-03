import { setupWorker } from 'msw/browser';
import { demoHandlers } from './handlers';

export const worker = setupWorker(...demoHandlers);
