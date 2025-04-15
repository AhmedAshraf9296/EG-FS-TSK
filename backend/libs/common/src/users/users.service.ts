import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common'; 
import { FindParams, ID } from '@db';
import { Pagination, PaginatedDto } from '@lib/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ErrorsMessagesAndCode } from '../assets/strings';
import { HashService } from '../services/hashing.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  @Inject(UsersRepository)
  private readonly usersRepository: UsersRepository;

  @Inject(HashService)
  private readonly HashService: HashService

  async create(createUserDto: CreateUserDto) {
    this.logger.debug('Creating a new user');

    if (createUserDto.email) {
      const emailExists = await this.usersRepository.checkEmailExists(
        createUserDto.email.toLowerCase(),
      )
      if (emailExists) {
        throw new BadRequestException(
          ErrorsMessagesAndCode.EmailExists.description,
          {
            description: ErrorsMessagesAndCode.EmailExists.code,
          },
        )
      }
      createUserDto.email = createUserDto.email.toLowerCase()
      if (createUserDto.phone) {
        const phoneExists = await this.usersRepository.checkPhoneExists(
          createUserDto.phone,
        )
        if (phoneExists) {
          throw new BadRequestException(
            ErrorsMessagesAndCode.PhoneExists.description,
            {
              description: ErrorsMessagesAndCode.PhoneExists.code,
            },
          )
        }
      }
    }
    
    const password = await this.HashService.hash(createUserDto.password)

    return this.usersRepository.create({...createUserDto,password});
  }

  async getOne(id: ID | string) {
    return this.usersRepository.findById(id).catch(() => null)
  }
  
  async findAll(pagination: Pagination, filter: FilterUserDto, select: FindParams<User>['select']): Promise<PaginatedDto<User>> {
    const filterOverrides = {}
    this.logger.debug('Finding all userss');
    const [items, total] = await Promise.all([
      this.usersRepository.find({
        filter: filter.toJSON(filterOverrides),
        select: select,
        sort: pagination.sortKey,
        sortDirection: pagination.sortAsc,
        skip: pagination.skip,
        take: pagination.limit,
      }),
      this.usersRepository.count(filter.toJSON(filterOverrides))
    ])

    return {
      total,
      pages: Math.ceil(total / pagination.limit),
      items,
    }
  }

  findOne(id: ID, select: FindParams<User>['select']) {
    this.logger.debug(`Finding user with id: ${id}`);
    return this.usersRepository.findById(id, select);
  }

  update(id: ID, updateUserDto: UpdateUserDto) {
    this.logger.debug(`Updating user with id: ${id}`);
    return this.usersRepository.updateById(id, updateUserDto);
  }

  remove(id: ID) {
    this.logger.debug(`Removing user with id: ${id}`);
    return this.usersRepository.deleteById(id);
  }

  async searchUsingPhoneReturnPassword(phone: string) {
    try {
      return await this.usersRepository.searchUsingPhoneReturnPassword(phone)
    } catch {
      return null
    }
  }

  searchUsingEmailReturnPassword(email: string) {
    return this.usersRepository.searchUsingEmailReturnPassword(email)
  }
  
}


