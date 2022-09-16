import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CiudadDto {
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
