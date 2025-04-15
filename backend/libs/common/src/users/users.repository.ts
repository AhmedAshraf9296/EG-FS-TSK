import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@db/repositories/AbstractRepository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';



@Injectable()
export class UsersRepository extends AbstractRepository< User > {
  protected logger: Logger = new Logger(UsersRepository.name)

  constructor(
    @InjectModel(User.name) protected readonly model: Model< User >,
  ) {
    super(model)
  }

  async checkEmailExists(email: string): Promise<boolean> {
    return (await this.model.countDocuments({ email })) > 0
  }

  async checkPhoneExists(phone: string): Promise<boolean> {
    return (await this.model.countDocuments({ phone })) > 0
  }

  searchUsingPhoneReturnPassword(phone: string) {
    return this.model.findOne({ phone }).select('+password').lean().exec()
  }

  searchUsingEmailReturnPassword(email: string) {
    return this.model.findOne({ email }).select('+password').lean().exec()
  }

}



