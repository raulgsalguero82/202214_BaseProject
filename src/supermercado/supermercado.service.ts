import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { SupermercadoEntity } from './supermercado.entity';

@Injectable()
export class SupermercadoService {
  constructor(
    @InjectRepository(SupermercadoEntity)
    private readonly supermercadoRepository: Repository<SupermercadoEntity>,
  ) {}

  async findAll(): Promise<SupermercadoEntity[]> {
    return await this.supermercadoRepository.find();
  }

  async findOne(id: string): Promise<SupermercadoEntity> {
    const output = await this.supermercadoRepository.findOne({ where: { id } });

    if (!output) {
      throw new BusinessLogicException(
        'No encontrado',
        BusinessError.NOT_FOUND,
      );
    }

    return output;
  }

  async create(supermercado: SupermercadoEntity): Promise<SupermercadoEntity> {
    if (supermercado.nombre.length < 10) {
      throw new BusinessLogicException(
        'Pais no valido',
        BusinessError.BAD_REQUEST,
      );
    }
    return await this.supermercadoRepository.create(supermercado);
  }

  async update(supermercado: SupermercadoEntity): Promise<SupermercadoEntity> {
    const existingEntity = await this.supermercadoRepository.findOne({
      where: { id: supermercado.id },
    });

    if (!existingEntity) {
      throw new BusinessLogicException(
        'No encontrado',
        BusinessError.NOT_FOUND,
      );
    }

    if (supermercado.nombre.length < 10) {
      throw new BusinessLogicException(
        'Pais no valido',
        BusinessError.BAD_REQUEST,
      );
    }

    return await this.supermercadoRepository.save(supermercado);
  }

  async delete(id: string) {
    const existingEntity = await this.supermercadoRepository.findOne({
      where: { id },
    });
    if (!existingEntity) {
      throw new BusinessLogicException(
        'No encontrado',
        BusinessError.NOT_FOUND,
      );
    }

    await this.supermercadoRepository.delete(existingEntity);
  }
}
