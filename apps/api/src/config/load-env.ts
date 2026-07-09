import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { config } from 'dotenv';

export function loadApiEnv() {
  const candidatePaths = [
    resolve(process.cwd(), '.env'),
    resolve(process.cwd(), '../../.env'),
    resolve(__dirname, '../../../.env'),
    resolve(__dirname, '../../../../../.env'),
  ];

  for (const path of candidatePaths) {
    if (existsSync(path)) {
      config({ path, override: false, quiet: true });
    }
  }
}
