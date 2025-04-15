import { TestDatabaseModule } from '@db/__tests__/db.module'
import { ConstructObjectId } from '@db/utils'
import { MongooseModule } from '@nestjs/mongoose'
import { Test, TestingModule } from '@nestjs/testing';
import { <%= singular(classify(name)) %>, <%= singular(classify(name)) %>Feature } from './entities/<%= singular(name) %>.entity'
import { <%= classify(name) %>Repository } from './<%= lowercased(name) %>.repository';
import { <%= classify(name) %>Service } from './<%= name %>.service';
import { generateFake<%= singular(classify(name)) %> } from './<%= name %>.test.helper'

describe('<%= classify(name) %>Service', () => {
  let service: <%= classify(name) %>Service;
  let repository: <%= classify(name) %>Repository
  const item = generateFake<%= singular(classify(name)) %>()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule, MongooseModule.forFeature([<%= singular(classify(name)) %>Feature])],
      providers: [<%= classify(name) %>Service, <%= classify(name) %>Repository],
    }).compile();

    service = module.get<<%= classify(name) %>Service>(<%= classify(name) %>Service);
    repository = module.get<<%= classify(name) %>Repository>(<%= classify(name) %>Repository)
  });

  describe('create', () => {
    it('should create a new item', async () => {
      const createDto = generateFake<%= singular(classify(name)) %>
      const result = await service.create(createDto);
      expect(result).toBeDefined();
    });

    it('should throw an error when data is invalid', async () => {
      const createDto = { item: string } as any;
      await expect(service.create(createDto)).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('should return all items', async () => {
      const pagination = {
        page: 1,
        limit: 10,
        skip: 0,
        sortKey: 'createdAt',
        sortAsc: -1,
      };
      const filter = {
        toJSON: () => ({}),
      } as any;
      const result = await service.findAll(pagination, filter);
      expect(result).toBeDefined();
    });

    it('should return empty array when no items found', async () => {
      const pagination = {
        page: 1,
        limit: 10,
        skip: 0,
        sortKey: 'createdAt',
        sortAsc: -1,
      };
      const filter = {
        toJSON: () => ({
          invalidFilterTest: "STRING"
          }),
      } as any;
      const result = await service.findAll(pagination, filter);
      expect(result.items).toEqual([]);
    });
  });
});

<%
// vim:set ft=template
%>
