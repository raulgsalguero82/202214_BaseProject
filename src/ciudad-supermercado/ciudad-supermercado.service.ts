import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class CiudadSupermercadoService {
  constructor(
    @InjectRepository(SupermercadoEntity)
    private readonly supermercadoRepository: Repository<SupermercadoEntity>,

    @InjectRepository(CiudadEntity)
    private readonly ciudadRepository: Repository<CiudadEntity>,
  ) {}

  async addSupermarketToCity(
    ciudadId: string,
    supermercadoId: string,
  ): Promise<CiudadEntity> {
    const supermercado: SupermercadoEntity =
      await this.supermercadoRepository.findOne({
        where: { id: supermercadoId },
      });

    if (!supermercado) {
      throw new BusinessLogicException(
        'No encontrado',
        BusinessError.NOT_FOUND,
      );
    }

    const ciudad: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id: ciudadId },
      relations: ['supermercados'],
    });

    if (!ciudad) {
      throw new BusinessLogicException(
        'No encontrado',
        BusinessError.NOT_FOUND,
      );
    }

    if (!ciudad.supermercados) ciudad.supermercados = [];

    ciudad.supermercados = [...ciudad.supermercados, supermercado];

    const saved = await this.ciudadRepository.save(ciudad);

    return saved;
  }

  async findSupermarketsFromCity(
    ciudadId: string,
  ): Promise<SupermercadoEntity[]> {
    const ciudad: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id: ciudadId },
      relations: ['supermercados'],
    });

    if (!ciudad) {
      throw new BusinessLogicException(
        'No encontrado',
        BusinessError.NOT_FOUND,
      );
    }

    return ciudad.supermercados;
  }

  async findSupermarketFromCity(
    ciudadId: string,
    supermercadoId: string,
  ): Promise<SupermercadoEntity> {
    const ciudad: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id: ciudadId },
      relations: ['supermercados'],
    });

    if (!ciudad) {
      throw new BusinessLogicException(
        'No encontrado',
        BusinessError.NOT_FOUND,
      );
    }

    const supermercado = ciudad.supermercados.find(
      (_supermercado) => _supermercado.id == supermercadoId,
    );

    if (!supermercado) {
      throw new BusinessLogicException(
        'No encontrado',
        BusinessError.NOT_FOUND,
      );
    }

    return supermercado;
  }

  async updateSupermarketsFromCity(
    ciudadId: string,
    supermercados: SupermercadoEntity[],
  ): Promise<CiudadEntity> {
    const ciudad: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id: ciudadId },
      relations: ['supermercados'],
    });

    if (!ciudad) {
      throw new BusinessLogicException(
        'No encontrado',
        BusinessError.NOT_FOUND,
      );
    }

    ciudad.supermercados = [];
    for (let i = 0; i < supermercados.length; i++) {
      const supermercado: SupermercadoEntity =
        await this.supermercadoRepository.findOne({
          where: { id: supermercados[i].id },
        });

      if (!supermercado) {
        throw new BusinessLogicException(
          'No encontrado',
          BusinessError.NOT_FOUND,
        );
      }

      ciudad.supermercados = [...ciudad.supermercados, supermercado];
    }

    return await this.ciudadRepository.save(ciudad);
  }

  async deleteSupermarketFromCity(
    ciudadId: string,
    supermercadoId: string,
  ): Promise<CiudadEntity> {
    const supermercado: SupermercadoEntity =
      await this.supermercadoRepository.findOne({
        where: { id: supermercadoId },
      });

    if (!supermercado) {
      throw new BusinessLogicException(
        'No encontrado',
        BusinessError.NOT_FOUND,
      );
    }

    const ciudad: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id: ciudadId },
      relations: ['supermercados'],
    });

    if (!ciudad) {
      throw new BusinessLogicException(
        'No encontrado',
        BusinessError.NOT_FOUND,
      );
    }

    if (!ciudad.supermercados) ciudad.supermercados = [];

    const assigned_supermercado = ciudad.supermercados.find(
      (_supermercado) => _supermercado.id == supermercadoId,
    );

    if (!assigned_supermercado) {
      throw new BusinessLogicException(
        'No encontrado',
        BusinessError.BAD_REQUEST,
      );
    }

    ciudad.supermercados = ciudad.supermercados.filter(
      (_supermercado) => _supermercado.id != supermercado.id,
    );

    const saved = await this.ciudadRepository.save(ciudad);

    return saved;
  }
}
