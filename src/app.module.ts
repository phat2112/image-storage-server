import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiModule } from './api/api.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import config from 'ormconfig';

@Module({
  imports: [
    MulterModule.register({
      dest: './public',
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(config),
    ApiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
