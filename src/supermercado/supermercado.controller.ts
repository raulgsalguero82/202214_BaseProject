import {
  Controller,
  Get,
  Post,
  Delete,
  UseInterceptors,
  Param,
  Body,
  Put,
  HttpCode,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { SupermercadoDto } from './supermercado.dto';
import { SupermercadoEntity } from './supermercado.entity';
import { SupermercadoService } from './supermercado.service';

@Controller('supermarkets')
@UseInterceptors(BusinessErrorsInterceptor)
export class SupermercadoController {
  constructor(private readonly service: SupermercadoService) {}
  @Get()
  async findAll() {
    return await this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.service.findOne(id);
  }

  @Post()
  async create(@Body() entityDto: SupermercadoDto) {
    const entity = plainToInstance(SupermercadoEntity, entityDto);
    return await this.service.create(entity);
  }

  @Put()
  async update(@Body() entityDto: SupermercadoDto) {
    const entity = plainToInstance(SupermercadoEntity, entityDto);
    return await this.service.update(entity);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    return await this.service.delete(id);
  }
}
