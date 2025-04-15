import { BadRequestException, Controller, Query, Get, Post, Body, Patch, Param, Delete, HttpStatus, Inject } from '@nestjs/common';
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
import { ApiBody, ApiParam, ApiTags, ApiQuery } from '@nestjs/swagger'
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { ID } from '@db'
import { User } from './entities/user.entity';


@ApiTags('users')
@Controller('users')
  
export class UsersController {
  @Inject(UsersService)
  protected readonly usersService: UsersService

  

  @SwaggerDocumentation({
    summary: 'Create user',
    badRequestDescription: 'Invalid Data',
    okDescription: 'user created',
    status: HttpStatus.CREATED,
    okType: User,
  })
  @ApiBody({ type: CreateUserDto })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @SwaggerDocumentation({
    summary: 'Find all users',
    okDescription: 'Return all users',
    badRequestDescription: 'Invalid pagination query',
    paginated: true,
    okType: User
  })
  @SwaggerDocumentationPaginationQuery()
  @ApiQuery({ type: FilterUserDto, required: false })
  @Get()
  findAll(
    @Paginate() pagination: Pagination,
    @FilterQuery() filter: FilterUserDto,
  ): Promise<PaginatedDto<User>> {
    return this.usersService.findAll(pagination, filter, {
      __v: 0,
      deletedAt: 0,
      });
  }

  @SwaggerDocumentation({
    summary: 'Find one user',
    okDescription: 'Return one user',
    badRequestDescription: 'Invalid user id',
    okType: User,
  })
  @ApiParam({
    name: 'id',
    type: String,
    required: true
  })
  @Get(':id')
  findOne(@IdParam('id') id: ID) {
    return this.usersService.findOne(id, {
      __v: 0,
      deletedAt: 0,
      });
  }

  @SwaggerDocumentation({
    summary: 'Update one user',
    okDescription: 'Return updated user',
    badRequestDescription: 'Invalid user id',
    okType: User,
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiParam({
    name: 'id',
    type: String,
    required: true
  })
  @Patch(':id')
  update(@IdParam('id') id: ID, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @SwaggerDocumentation({
    summary: 'Remove one user',
    okDescription: 'Return removed user',
    badRequestDescription: 'Invalid user id',
    okType: User,
  })
  @ApiParam({
    name: 'id',
    type: String,
    required: true
  })
  @Delete(':id')
  remove(@IdParam('id') id: ID) {
    return this.usersService.remove(id);
  }  
}


