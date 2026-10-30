import { Module } from '@nestjs/common';
import { PredictionsService } from './predictions.service.js';
import { PredictionsController } from './predictions.controller.js';

@Module({
  controllers: [PredictionsController],
  providers: [PredictionsService],
})
export class PredictionsModule {}
