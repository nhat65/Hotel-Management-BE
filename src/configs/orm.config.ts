import { DataSource } from 'typeorm';
import { databaseConfig } from './database.config';

const config = {
  ...databaseConfig,
  migrations: ['src/migrations/*.ts'],
  entities: ['src/**/*.entity.ts'],
};

export default new DataSource(config as any);
