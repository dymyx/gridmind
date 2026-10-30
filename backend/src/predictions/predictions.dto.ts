import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsInt,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class PredictItemDto {
  @IsUUID()
  driverId: string;

  @IsInt()
  @Min(1)
  @Max(3)
  pos: number;
}

export class CreatePredictionDto {
  @IsUUID()
  race_id: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  @ValidateNested({ each: true })
  @Type(() => PredictItemDto)
  predicts: PredictItemDto[];
}
