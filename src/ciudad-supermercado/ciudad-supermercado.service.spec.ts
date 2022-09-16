import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';
import { Repository } from 'typeorm';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';
import { TypeOrmTestingConfig } from '../shared/test-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';

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
});
