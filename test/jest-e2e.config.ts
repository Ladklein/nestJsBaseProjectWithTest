import type { Config } from 'jest';
import * as defaults from './jest.config';
import { resolve } from 'path';

const config: Config = {
  ...defaults.default,
  setupFilesAfterEnv: [
    resolve(__dirname, 'e2e/bootstrap.e2e-spec.ts'),
    resolve(__dirname, 'e2e/fixture.e2e-spec.ts'),
  ],
  testMatch: ['<rootDir>test/e2e/user/**/?(*.)(e2e-spec).{js,jsx,ts,tsx}'],
};
export default config;
