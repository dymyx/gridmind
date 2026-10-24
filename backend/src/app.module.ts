import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ConfigModule } from '@nestjs/config';
import { DictModule } from './dict/dict.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { RacesModule } from './races/races.module.js';
import { StandingsModule } from './standings/standings.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    DictModule,
    AuthModule,
    UsersModule,
    RacesModule,
    StandingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
