import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CiudadDto {
  @IsOptional()
  id: string;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  pais: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  habitantes: number;
}
