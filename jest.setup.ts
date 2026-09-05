import { config as chargerEnv } from 'dotenv';
import { TextEncoder, TextDecoder } from 'node:util';
import '@testing-library/jest-dom';

chargerEnv({ path: '.env.local', quiet: true });

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  // @ts-expect-error — le TextDecoder de Node est suffisamment compatible pour nos tests
  global.TextDecoder = TextDecoder;
}