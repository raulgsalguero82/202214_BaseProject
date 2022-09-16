import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { SupermercadoDto } from '../supermercado/supermercado.dto';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';

@Controller('cities')
@UseInterceptors(BusinessErrorsInterceptor)
export class CiudadSupermercadoController {
  constructor(private readonly service: CiudadSupermercadoService) {}

  @Post(':ciudadId/supermarkets/:supermercadoId')
  async addSupermarketToCity(
    @Param('ciudadId') ciudadId: string,
    @Param('supermercadoId') supermercadoId: string,
  ) {
    return await this.service.addSupermarketToCity(ciudadId, supermercadoId);
  }

  @Get(':ciudadId/supermarkets')
  async findSupermarketsFromCity(@Param('ciudadId') ciudadId: string) {
    return await this.service.findSupermarketsFromCity(ciudadId);
  }

  @Get(':ciudadId/supermarkets/:supermercadoId')
  async findSupermarketFromCity(
    @Param('ciudadId') ciudadId: string,
    @Param('supermercadoId') supermercadoId: string,
  ) {
    return await this.service.findSupermarketFromCity(ciudadId, supermercadoId);
  }

  @Post(':ciudadId/supermarkets')
  async updateSupermarketsFromCity(
    @Param('ciudadId') ciudadId: string,
    @Body() entityDto: SupermercadoDto[],
  ) {
    const entities: SupermercadoEntity[] = plainToInstance(
      SupermercadoEntity,
      entityDto,
    );
    return await this.service.updateSupermarketsFromCity(ciudadId, entities);
  }

  @Delete(':ciudadId/supermarkets/:supermercadoId')
  @HttpCode(204)
  async deleteSupermarketFromCity(
    @Param('ciudadId') ciudadId: string,
    @Param('supermercadoId') supermercadoId: string,
  ) {
    return await this.service.deleteSupermarketFromCity(
      ciudadId,
      supermercadoId,
    );
  }
}
