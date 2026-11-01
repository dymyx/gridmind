import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { CreatePredictionDto } from './predictions.dto.js';
import { PredictionsService } from './predictions.service.js';

@UseGuards(JwtAuthGuard)
@Controller('predictions')
export class PredictionsController {
  constructor(private readonly predictionsService: PredictionsService) {}

  @Get('user')
  getUserPredictions(
    @Req() req: { user: { sub: string } },
    @Query('race_id') race_id?: string,
    @Query('count') count?: number,
  ) {
    return this.predictionsService.getUserPredictions(
      req.user.sub,
      race_id,
      Number(count),
    );
  }

  @Get('top/:race_id')
  getTopPredictionsByRace(
    @Param('race_id') race_id: string,
    @Query('count', new ParseIntPipe({ optional: true })) count?: number,
  ) {
    return this.predictionsService.getTopPredictsByRace(race_id, count);
  }

  @Get('can')
  getCanPredict(
    @Query('race_id') race_id: string,
    @Req() req: { user: { sub: string } },
  ) {
    return this.predictionsService.getCanPredict(race_id, req.user.sub);
  }

  @Post('create')
  createPrediction(
    @Body() dto: CreatePredictionDto,
    @Req() req: { user: { sub: string } },
  ) {
    return this.predictionsService.createPredict(req.user.sub, dto);
  }
}
