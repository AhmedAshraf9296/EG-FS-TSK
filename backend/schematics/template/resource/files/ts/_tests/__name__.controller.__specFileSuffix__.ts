import { TestDatabaseModule } from '@db/__tests__/db.module'
import { ConstructObjectId } from '@db/utils'
import { MongooseModule } from '@nestjs/mongoose'
import { Test, TestingModule } from '@nestjs/testing'
import { <%= singular(classify(name)) %>, <%= singular(classify(name)) %>Feature } from '../entities/<%= singular(name) %>.entity'
import { <%= classify(name) %>Controller } from '../<%= name %>.controller';
import { <%= classify(name) %>Repository } from '../<%= lowercased(name) %>.repository';
import { <%= classify(name) %>Service } from '../<%= name %>.service';
import { generateFake<%= singular(classify(name)) %> } from './<%= name %>.test.helper'

describe('<%= classify(name) %>Controller', () => {
  let controller: <%= classify(name) %>Controller
  let repository: <%= classify(name) %>Repository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule, MongooseModule.forFeature([<%= singular(classify(name)) %>Feature])],
      controllers: [<%= classify(name) %>Controller],
      providers: [<%= classify(name) %>Service, <%= classify(name) %>Repository],
    }).compile();

    controller = module.get<<%= classify(name) %>Controller>(<%= classify(name) %>Controller);
    repository = module.get<<%= classify(name) %>Repository>(<%= classify(name) %>Repository)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined();
  })

  it('should return an array of <%= lowercased(name) %>', async () => {
    const items = await controller.findAll({
      page: 1,
      limit: 10,
      skip: 0,
      sortKey: 'createdAt',
      sortAsc: -1
    })
    expect(items.items).toBeInstanceOf(Array)
    expect(items.pages).toBeGreaterThanOrEqual(0)
    expect(items.total).toBeGreaterThanOrEqual(0)
  })

  it('should create a <%= lowercased(singular(name)) %>', async () => {
    const <%= lowercased(singular(name)) %> = await controller.create(generateFake<%= singular(classify(name)) %>())
    expect(<%= lowercased(singular(name)) %>).toBeInstanceOf(Object)
  })

  it('should return a <%= lowercased(singular(name)) %>', async () => {
    const <%= lowercased(singular(name)) %>Created = await controller.create(generateFake<%= singular(classify(name)) %>())
    expect(<%= lowercased(singular(name)) %>Created).toBeInstanceOf(Object)
    const <%= lowercased(singular(name)) %>  = await controller.findOne(
        <%= lowercased(singular(name)) %>Created._id
    )
    expect(<%= lowercased(singular(name)) %>).toBeInstanceOf(Object)
  })
});

<%
// vim: set ft=template
%>
