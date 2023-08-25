import type { Config } from 'jest';

const config: Config = {
  verbose: true,
  rootDir: '../',
  moduleFileExtensions: ['js', 'json', 'ts'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  moduleNameMapper: {
    '@app/util-kernel': '<rootDir>libs/util-kernel/src',
    '@app/util-kernel/(.*)$': '<rootDir>libs/util-kernel/src/$1',
    '@app/util-routes': '<rootDir>libs/util-routes/src',
    '@app/util-routes/(.*)$': '<rootDir>libs/util-routes/src/$1',
    '@app/error-core': '<rootDir>libs/error-core/src',
    '@app/error-core/(.*)$': '<rootDir>libs/error-core/src/$1',
    '@app/data-generic': '<rootDir>libs/data-generic/src',
    '@app/data-generic/(.*)$': '<rootDir>libs/data-generic/src/$1',
    '@app/error-core-api': '<rootDir>libs/error-core-api/src',
    '@app/error-core-api/(.*)$': '<rootDir>libs/error-core-api/src/$1',
    '@app/domain-core': '<rootDir>libs/domain-core/src',
    '@app/domain-core/(.*)$': '<rootDir>libs/domain-core/src/$1',
  },
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>test/**/*.(test).{js,jsx,ts,tsx}',
    '<rootDir>test/**/?(*.)(spec|test).{js,jsx,ts,tsx}',
  ],
};

export default config;
