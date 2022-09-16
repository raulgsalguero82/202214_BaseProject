import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/test-utils/typeorm-testing-config';
import { CiudadEntity } from './ciudad.entity';
import { CiudadService } from './ciudad.service';
import { faker } from '@faker-js/faker';
import { BusinessError } from '../shared/errors/business-errors';

describe('CiudadService', () => {
  let service: CiudadService;
  let repository: Repository<CiudadEntity>;
  let entityList: CiudadEntity[];

  const seedDatabase = async () => {
    repository.clear();
    entityList = [];
    for (let i = 0; i < 5; i++) {
      const ciudad: CiudadEntity = await repository.save({
        id: faker.database.mongodbObjectId(),
        nombre: faker.address.city(),
        pais: service.paisesPermitidos[
          faker.datatype.number({
            min: 0,
            max: 2,
          })
        ],
        habitantes: faker.datatype.number({
          min: 1,
          max: 2000000,
        }),
      });
      entityList.push(ciudad);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadService],
    }).compile();

    service = module.get<CiudadService>(CiudadService);
    repository = module.get<Repository<CiudadEntity>>(
      getRepositoryToken(CiudadEntity),
    );

    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('FindOne', async () => {
    const entity = await service.findOne(entityList[0].id);
    expect(entity.id).toBe(entityList[0].id);
  });

  it('FindOne non existing entity', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'type',
      BusinessError.NOT_FOUND,
    );
  });

  it('FindAll', async () => {
    const entities = await service.findAll();
    expect(entities.length).toBe(entityList.length);
  });

  it('Create', async () => {
    const entity = {
      id: faker.database.mongodbObjectId(),
      nombre: faker.address.city(),
      pais: service.paisesPermitidos[0],
      habitantes: faker.datatype.number({
        min: 1,
        max: 2000000,
      }),
    };

    const savedEntity: CiudadEntity = await service.create(entity);
    expect(savedEntity.nombre).toBe(savedEntity.nombre);
  });

  it('Create invalid entity', async () => {
    const entity = {
      id: '',
      nombre: faker.address.city(),
      pais: 'Colombia',
      habitantes: faker.datatype.number({
        min: 1,
        max: 2000000,
      }),
    };

    await expect(() => service.create(entity)).rejects.toHaveProperty(
      'type',
      BusinessError.BAD_REQUEST,
    );
  });

  it('Update entity', async () => {
    const entity = entityList[0];
    entity.nombre = faker.address.city();
    const saveEntity = await service.update(entity);
    expect(saveEntity.nombre).toBe(entity.nombre);
  });

  it('update non existing entity', async () => {
    const entity = entityList[0];
    entity.id = '0';
    await expect(() => service.update(entity)).rejects.toHaveProperty(
      'type',
      BusinessError.NOT_FOUND,
    );
  });

  it('Invalid entity update', async () => {
    const entity = entityList[0];
    entity.pais = 'Colombia';

    await expect(() => service.update(entity)).rejects.toHaveProperty(
      'type',
      BusinessError.BAD_REQUEST,
    );
  });

  it('Delete entity', async () => {
    const intialLen = entityList.length;
    await service.delete(entityList[0].id);
    const entities = await service.findAll();
    expect(entities.length).toBe(intialLen - 1);
  });

  it('Delete non existing entity', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'type',
      BusinessError.NOT_FOUND,
    );
  });
});
