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
import { CiudadDto } from './ciudad.dto';
import { CiudadEntity } from './ciudad.entity';
import { CiudadService } from './ciudad.service';

@Controller('cities')
@UseInterceptors(BusinessErrorsInterceptor)
export class CiudadController {
  constructor(private readonly service: CiudadService) {}

  @Get()
  async findAll() {
    return await this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.service.findOne(id);
  }

  @Post()
  async create(@Body() entityDto: CiudadDto) {
    const entity = plainToInstance(CiudadEntity, entityDto);
    return await this.service.create(entity);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() entityDto: CiudadDto) {
    const entity = plainToInstance(CiudadEntity, entityDto);
    entity.id = id;
    return await this.service.update(entity);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    return await this.service.delete(id);
  }
}
