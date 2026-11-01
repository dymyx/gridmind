import { Module } from '@nestjs/common';
import { PredictionsController } from './predictions.controller.js';
import { PredictionsService } from './predictions.service.js';
import { ScoringService } from './scoreing.service.js';

@Module({
  controllers: [PredictionsController],
  providers: [PredictionsService, ScoringService],
  exports: [ScoringService],
})
export class PredictionsModule {}
