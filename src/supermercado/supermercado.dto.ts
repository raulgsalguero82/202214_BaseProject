import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class SupermercadoDto {
  @IsOptional()
  id: string;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsNumber()
  latitud: number;

  @IsNumber()
  longitud: number;

  @IsUrl()
  @IsNotEmpty()
  url: string;
}
