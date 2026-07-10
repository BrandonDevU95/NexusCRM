import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { loadApiEnv } from '../config/load-env';
import { createDatabaseOptions } from './database-options';

loadApiEnv();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is required');
}

const appDataSource = new DataSource(createDatabaseOptions(connectionString));

export default appDataSource;
