import { Module } from '@nestjs/common';
import { DictModule } from '../dict/dict.module.js';
import { PredictionsModule } from '../predictions/predictions.module.js';
import { RacesController } from './races.controller.js';
import { RacesService } from './races.service.js';
import { MockResultsProvider } from './results/mock-results.provider.js';
import { RaceResultsService } from './results/race-results.service.js';
import { RESULTS_PROVIDER } from './results/results-provider.js';

@Module({
  imports: [DictModule, PredictionsModule],
  controllers: [RacesController],
  providers: [
    RacesService,
    RaceResultsService,
    MockResultsProvider,
    { provide: RESULTS_PROVIDER, useExisting: MockResultsProvider },
  ],
})
export class RacesModule {}
