import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';
import { Repository } from 'typeorm';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';
import { TypeOrmTestingConfig } from '../shared/test-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BusinessError } from '../shared/errors/business-errors';

describe('CiudadSupermercadoService', () => {
  let service: CiudadSupermercadoService;

  let ciudadRepository: Repository<CiudadEntity>;
  let ciudadList: CiudadEntity[];

  let supermercadoRepository: Repository<SupermercadoEntity>;
  let supermercadoList: SupermercadoEntity[];

  const seedCiudadDatabase = async () => {
    ciudadRepository.clear();
    ciudadList = [];
    for (let i = 0; i < 5; i++) {
      const ciudad: CiudadEntity = await ciudadRepository.save({
        id: faker.database.mongodbObjectId(),
        nombre: faker.address.city(),
        pais: 'Argentina',
        habitantes: faker.datatype.number({
          min: 1,
          max: 2000000,
        }),
        supermercados: [],
      });
      ciudadList.push(ciudad);
    }
  };

  const seedSupermercadoDatabase = async () => {
    supermercadoRepository.clear();
    supermercadoList = [];
    for (let i = 0; i < 5; i++) {
      const supermercado: SupermercadoEntity =
        await supermercadoRepository.save({
          id: faker.database.mongodbObjectId(),
          nombre: faker.datatype.string(11),
          latitud: parseFloat(faker.address.latitude()),
          longitud: parseFloat(faker.address.longitude()),
          url: faker.internet.url(),
          ciudades: [],
        });
      supermercadoList.push(supermercado);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadSupermercadoService],
    }).compile();

    service = module.get<CiudadSupermercadoService>(CiudadSupermercadoService);

    ciudadRepository = module.get<Repository<CiudadEntity>>(
      getRepositoryToken(CiudadEntity),
    );

    supermercadoRepository = module.get<Repository<SupermercadoEntity>>(
      getRepositoryToken(SupermercadoEntity),
    );

    await seedCiudadDatabase();
    await seedSupermercadoDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Add supermercado to city', async () => {
    const savedCity = await service.addSupermarketToCity(
      ciudadList[0].id,
      supermercadoList[0].id,
    );
    expect(savedCity.supermercados.length).toBe(1);
    expect(savedCity.supermercados[0].id).toBe(supermercadoList[0].id);
  });

  it('Add supermercado to non existing city', async () => {
    await expect(() =>
      service.addSupermarketToCity('0', supermercadoList[0].id),
    ).rejects.toHaveProperty('type', BusinessError.NOT_FOUND);
  });

  it('Add non existing supermercado to city', async () => {
    await expect(() =>
      service.addSupermarketToCity(ciudadList[0].id, '0'),
    ).rejects.toHaveProperty('type', BusinessError.NOT_FOUND);
  });

  it('Find supermercados from city', async () => {
    await service.addSupermarketToCity(
      ciudadList[0].id,
      supermercadoList[0].id,
    );

    const supermercados = await service.findSupermarketsFromCity(
      ciudadList[0].id,
    );

    expect(supermercados.length).toBe(1);
    expect(supermercados[0].id).toBe(supermercadoList[0].id);
  });

  it('Find supermercados from non existing city', async () => {
    await expect(() =>
      service.findSupermarketsFromCity('0'),
    ).rejects.toHaveProperty('type', BusinessError.NOT_FOUND);
  });

  it('Find supermercado from city', async () => {
    await service.addSupermarketToCity(
      ciudadList[0].id,
      supermercadoList[0].id,
    );

    const supermercado = await service.findSupermarketFromCity(
      ciudadList[0].id,
      supermercadoList[0].id,
    );

    expect(supermercado.id).toBe(supermercadoList[0].id);
  });

  it('Find supermercados from non existing city', async () => {
    await expect(() =>
      service.findSupermarketFromCity('0', supermercadoList[0].id),
    ).rejects.toHaveProperty('type', BusinessError.NOT_FOUND);
  });

  it('Find non exising supermercado from city', async () => {
    await expect(() =>
      service.findSupermarketFromCity(ciudadList[0].id, '0'),
    ).rejects.toHaveProperty('type', BusinessError.NOT_FOUND);
  });

  it('Update supermercados from city', async () => {
    const ciudad = await service.updateSupermarketsFromCity(
      ciudadList[0].id,
      supermercadoList,
    );

    expect(ciudad.supermercados.length).toBe(supermercadoList.length);
  });

  it('Update supermercados from non existing city', async () => {
    await expect(() =>
      service.updateSupermarketsFromCity('0', supermercadoList),
    ).rejects.toHaveProperty('type', BusinessError.NOT_FOUND);
  });

  it('Update non existing supermercados from city', async () => {
    supermercadoList[0].id = '0';

    await expect(() =>
      service.updateSupermarketsFromCity(ciudadList[0].id, supermercadoList),
    ).rejects.toHaveProperty('type', BusinessError.NOT_FOUND);
  });

  it('Delete supermercado from city', async () => {
    let ciudad: CiudadEntity = await service.addSupermarketToCity(
      ciudadList[0].id,
      supermercadoList[0].id,
    );

    expect(ciudad.supermercados.length).toBe(1);

    ciudad = await service.deleteSupermarketFromCity(
      ciudadList[0].id,
      supermercadoList[0].id,
    );

    expect(ciudad.supermercados.length).toBe(0);
  });

  it('Delete supermercado from non existing city', async () => {
    const ciudad: CiudadEntity = await service.addSupermarketToCity(
      ciudadList[0].id,
      supermercadoList[0].id,
    );

    expect(ciudad.supermercados.length).toBe(1);

    await expect(() =>
      service.deleteSupermarketFromCity('0', supermercadoList[0].id),
    ).rejects.toHaveProperty('type', BusinessError.NOT_FOUND);
  });

  it('Delete not assigned supermercado from city', async () => {
    const ciudad: CiudadEntity = await service.addSupermarketToCity(
      ciudadList[0].id,
      supermercadoList[0].id,
    );

    expect(ciudad.supermercados.length).toBe(1);

    await expect(() =>
      service.deleteSupermarketFromCity(
        ciudadList[0].id,
        supermercadoList[1].id,
      ),
    ).rejects.toHaveProperty('type', BusinessError.BAD_REQUEST);
  });

  it('Delete non existing supermercado from city', async () => {
    const ciudad: CiudadEntity = await service.addSupermarketToCity(
      ciudadList[0].id,
      supermercadoList[0].id,
    );

    expect(ciudad.supermercados.length).toBe(1);

    await expect(() =>
      service.deleteSupermarketFromCity('0', supermercadoList[0].id),
    ).rejects.toHaveProperty('type', BusinessError.NOT_FOUND);
  });
});
