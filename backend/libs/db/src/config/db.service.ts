import {
  Injectable,
  Logger,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common'
import { InjectConnection } from '@nestjs/mongoose'
import mongoose, { Connection } from 'mongoose'

@Injectable()
export class DatabaseService implements OnApplicationShutdown, OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name)

  constructor(@InjectConnection() private readonly connection: Connection) {}

  // This literally does nothing, but it looks cool
  onModuleInit() {
    return this.connection
      .on('connecting', () => {
        this.logger.debug('connecting to MongoDB...')
      })
      .on('open', () => {
        this.logger.debug('MongoDB connection opened!')
      })
      .on('error', error => {
        this.logger.error(`Error in MongoDB connection: ${error}`)
        // this.connection.close()
      })
      .on('disconnected', () => {
        this.logger.debug('MongoDB disconnected!')
      })
      .once('open', async () => {
        this.logger.debug('Connected to MongoDB!')
      })
  }

  getDbHandle(): Connection {
    return this.connection
  }

  getCollection(item: string) {
    return this.connection.collection(item)
  }

  closeConnection(): Promise<void> {
    return mongoose.disconnect()
  }

  onApplicationShutdown(signal?: string | undefined) {
    this.logger.debug(`DatabaseService.onApplicationShutdown: ${signal}`)
    return this.closeConnection()
  }
}
