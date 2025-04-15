<% if (crud && type === 'rest') { %>import { BadRequestException, Controller, Query, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import {
  IdParam,
  FilterQuery,
  Paginate,
  Pagination,
  SwaggerDocumentation,
  SwaggerDocumentationPaginationQuery,
  PaginatedDto,
  BulkDeleteResponse
} from '@lib/common'
import { PaginatedDto } from '@lib/common/dto'
import { ApiBody, ApiParam, ApiTags, ApiQuery } from '@nestjs/swagger'<%
} else if (crud && type === 'microservice') { %>import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';<%
} else { %>import { Controller } from '@nestjs/common';<%
} %>
import { <%= classify(name) %>Service } from './<%= name %>.service';<% if (crud) { %>
import { Create<%= singular(classify(name)) %>Dto } from './dto/create-<%= singular(name) %>.dto';
import { Filter<%= singular(classify(name)) %>Dto } from './dto/filter-<%= singular(name) %>.dto';
import { Update<%= singular(classify(name)) %>Dto } from './dto/update-<%= singular(name) %>.dto';<% } %>
import { Delete<%= singular(classify(name)) %>Dto } from './dto/delete-<%= singular(name) %>.dto';
import { ID } from '@db'
import { <%= singular(classify(name)) %> } from './entities/<%= singular(name) %>.entity';

<% if (type === 'rest') { %>
@ApiTags('<%= dasherize(name) %>')
@Controller('<%= dasherize(name) %>')
  <% } else { %>@Controller()<% } %>
export class <%= classify(name) %>Controller {
  protected readonly <%= lowercased(name) %>Service: <%= classify(name) %>Service

  <% if (type === 'rest' && crud) { %>

  @SwaggerDocumentation({
    summary: 'Create <%= singular(lowercased(name)) %>',
    badRequestDescription: 'Invalid Data',
    okDescription: '<%= singular(lowercased(name)) %> created',
    status: HttpStatus.CREATED,
    okType: <%= singular(classify(name)) %>,
  })
  @ApiBody({ type: Create<%= singular(classify(name)) %>Dto })
  @Post()
  create(@Body() create<%= singular(classify(name)) %>Dto: Create<%= singular(classify(name)) %>Dto) {
    return this.<%= lowercased(name) %>Service.create(create<%= singular(classify(name)) %>Dto);
  }

  @SwaggerDocumentation({
    summary: 'Find all <%= lowercased(name) %>',
    okDescription: 'Return all <%= lowercased(name) %>',
    badRequestDescription: 'Invalid pagination query',
    paginated: true,
    okType: <%= singular(classify(name)) %>
  })
  @SwaggerDocumentationPaginationQuery()
  @ApiQuery({ type: Filter<%= singular(classify(name)) %>Dto, required: false })
  @Get()
  findAll(
    @Paginate() pagination: Pagination,
    @FilterQuery() filter: Filter<%= singular(classify(name)) %>Dto,
  ): Promise<PaginatedDto<<%= singular(classify(name)) %>>> {
    return this.<%= lowercased(name) %>Service.findAll(pagination, filter, {
      __v: 0,
      deletedAt: 0,
      });
  }

  @SwaggerDocumentation({
    summary: 'Find one <%= singular(name) %>',
    okDescription: 'Return one <%= singular(name) %>',
    badRequestDescription: 'Invalid <%= singular(name) %> id',
    okType: <%= singular(classify(name)) %>,
  })
  @ApiParam({
    name: 'id',
    type: String,
    required: true
  })
  @Get(':id')
  findOne(@IdParam('id') id: ID) {
    return this.<%= lowercased(name) %>Service.findOne(id, {
      __v: 0,
      deletedAt: 0,
      });
  }

  @SwaggerDocumentation({
    summary: 'Update one <%= singular(name) %>',
    okDescription: 'Return updated <%= singular(name) %>',
    badRequestDescription: 'Invalid <%= singular(name) %> id',
    okType: <%= singular(classify(name)) %>,
  })
  @ApiBody({ type: Update<%= singular(classify(name)) %>Dto })
  @ApiParam({
    name: 'id',
    type: String,
    required: true
  })
  @Patch(':id')
  update(@IdParam('id') id: ID, @Body() update<%= singular(classify(name)) %>Dto: Update<%= singular(classify(name)) %>Dto) {
    return this.<%= lowercased(name) %>Service.update(id, update<%= singular(classify(name)) %>Dto);
  }

  @SwaggerDocumentation({
    summary: 'Remove one <%= singular(name) %>',
    okDescription: 'Return removed <%= singular(name) %>',
    badRequestDescription: 'Invalid <%= singular(name) %> id',
    okType: <%= singular(classify(name)) %>,
  })
  @ApiParam({
    name: 'id',
    type: String,
    required: true
  })
  @Delete(':id')
  remove(@IdParam('id') id: ID) {
    return this.<%= lowercased(name) %>Service.remove(id);
  }

  @SwaggerDocumentation({
    summary: 'bulk remove <%= name %>',
    okDescription: 'Return removed numbers <%= name %>',
    badRequestDescription: 'Invalid <%= name %> ids or empty array',
    okType: BulkDeleteResponse,
  })
  @Post('/bulk/delete')
  async bulkRemove(@Body() delete<%= singular(classify(name)) %>Dto: Delete<%= singular(classify(name)) %>Dto): Promise<BulkDeleteResponse> {
    if (delete<%= singular(classify(name)) %>Dto.ids.length < 1) {
      throw new BadRequestException()
    }
    const numOfDeleted = await this.<%= lowercased(name) %>Service.bulkRemove(delete<%= singular(classify(name)) %>Dto.ids);
    return {
      message: "Deleted Items",
      numOfDeleted,
      recivedIdsLength: delete<%= singular(classify(name)) %>Dto.ids.length,
      foundAllItems: numOfDeleted === delete<%= singular(classify(name)) %>Dto.ids.length
      
    }
  }

  <% } else if (type === 'microservice' && crud) { %>

  @MessagePattern('create<%= singular(classify(name)) %>')
  create(@Payload() create<%= singular(classify(name)) %>Dto: Create<%= singular(classify(name)) %>Dto) {
    return this.<%= lowercased(name) %>Service.create(create<%= singular(classify(name)) %>Dto);
  }

  @MessagePattern('findAll<%= classify(name) %>')
  findAll() {
    return this.<%= lowercased(name) %>Service.findAll();
  }

  @MessagePattern('findOne<%= singular(classify(name)) %>')
  findOne(@Payload() id: number) {
    return this.<%= lowercased(name) %>Service.findOne(id);
  }

  @MessagePattern('update<%= singular(classify(name)) %>')
  update(@Payload() update<%= singular(classify(name)) %>Dto: Update<%= singular(classify(name)) %>Dto) {
    return this.<%= lowercased(name) %>Service.update(update<%= singular(classify(name)) %>Dto.id, update<%= singular(classify(name)) %>Dto);
  }

  @MessagePattern('remove<%= singular(classify(name)) %>')
  remove(@Payload() id: number) {
    return this.<%= lowercased(name) %>Service.remove(id);
  }<% } %>
}

<%
// vim: set ft=template
%>
