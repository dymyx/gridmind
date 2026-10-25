import { Module } from '@nestjs/common';
import { RacesService } from './races.service.js';
import { RacesController } from './races.controller.js';
import { DictModule } from '../dict/dict.module.js';

@Module({
  imports: [DictModule],
  controllers: [RacesController],
  providers: [RacesService],
})
export class RacesModule {}
