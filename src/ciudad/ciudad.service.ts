import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { CiudadEntity } from './ciudad.entity';

@Injectable()
export class CiudadService {
  paisesPermitidos = ['Argentina', 'Ecuador', 'Paraguay'];
  constructor(
    @InjectRepository(CiudadEntity)
    private readonly ciduadRepository: Repository<CiudadEntity>,
  ) {}

  async findAll(): Promise<CiudadEntity[]> {
    return await this.ciduadRepository.find();
  }

  async findOne(id: string): Promise<CiudadEntity> {
    const output = await this.ciduadRepository.findOne({ where: { id } });

    if (!output) {
      throw new BusinessLogicException(
        'No encontrado',
        BusinessError.NOT_FOUND,
      );
    }

    return output;
  }

  async create(ciudad: CiudadEntity): Promise<CiudadEntity> {
    if (this.paisesPermitidos.indexOf(ciudad.pais) == -1) {
      throw new BusinessLogicException(
        'Pais no valido',
        BusinessError.BAD_REQUEST,
      );
    }
    const savedCiudad = await this.ciduadRepository.save(ciudad);
    return savedCiudad;
  }

  async update(ciudad: CiudadEntity): Promise<CiudadEntity> {
    if (this.paisesPermitidos.indexOf(ciudad.pais) == -1) {
      throw new BusinessLogicException(
        'Pais no valido',
        BusinessError.BAD_REQUEST,
      );
    }

    const existingEntity = await this.ciduadRepository.findOne({
      where: { id: ciudad.id },
    });

    if (!existingEntity) {
      throw new BusinessLogicException(
        'No encontrado',
        BusinessError.NOT_FOUND,
      );
    }

    return await this.ciduadRepository.save(ciudad);
  }

  async delete(id: string) {
    const existingEntity = await this.ciduadRepository.findOne({
      where: { id },
    });
    if (!existingEntity) {
      throw new BusinessLogicException(
        'No encontrado',
        BusinessError.NOT_FOUND,
      );
    }

    await this.ciduadRepository.delete(existingEntity);
  }
}
