import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const creerConfigJest = nextJest({
  dir: './',
});

const configPersonnalisee: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  collectCoverageFrom: ['lib/services/**/*.ts', 'lib/utils/money.ts'],
  coverageThreshold: {
    'lib/services/': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

export default creerConfigJest(configPersonnalisee);