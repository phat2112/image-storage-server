import { ConnectionOptions } from 'typeorm';

const config: ConnectionOptions = {
  type: 'mysql',
  host: '192.168.1.124',
  port: 3306,
  username: 'phat',
  password: 'Admin@123',
  database: 'imageStorage',
  entities: ['dist/**/entity/*.entity{.ts,.js}'],
  synchronize: true,
  migrations: ['dist/src/migrations/*.js'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};

export default config;
