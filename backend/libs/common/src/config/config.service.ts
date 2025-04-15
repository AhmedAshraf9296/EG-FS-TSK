import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { APP_ENV } from './config.env'

@Injectable()
export class CustomConfigService {
  private readonly configService: ConfigService
  constructor() {
    // Initialize ConfigService internally
    this.configService = new ConfigService()
  }
  getBrevoKey() {
    return this.get('BREVO_API_KEY', '')
  }

  isDev(): boolean {
    return this.getAppEnv() === APP_ENV.DEV
  }

  get<T>(key: string, def?: T): T {
    return this.configService.get<T>(key) || (def as T)
  }

  getBoolean(key: string, def = false): boolean {
    const value = this.configService.get<string>(key)
    return value === 'true' ? true : value === 'false' ? false : def
  }

  getPort(): string {
    return this.get<string>('PORT', '8000')
  }

  getAppEnv(): string {
    return this.get<string>('APP_ENV', 'PROD')
  }

  getAppPort(): string {
    return this.get<string>('APP_PORT', '8000')
  }

  getMongoDb(): string {
    const db = this.get<string>('MONGO_DB', 'mongodb://localhost:27017/db')
    
    return this.get<string>('MONGO_DB', 'mongodb://localhost:27017/db')
  }

  getDbName(): string {
    return this.getMongoDb().split('/').pop() || 'db'
  }

  getRedisUrl(): string {
    return this.get('REDIS_URL', 'redis://localhost:6379')
  }

  getOpenAiKey(): string | undefined {
    return this.get('OPENAI_API_KEY', '')
  }

  getOpenAiUrl() {
    return this.get('OPENAI_BASE_URL', '')
  }

  getServiceBusNamespace(): string {
    return this.get<string>('AZURE_SERVICEBUS_FULLYQUALIFIEDNAMESPACE', '')
  }

  getAzureSearchKey(): string {
    return this.get('AZURE_SEARCH_KEY', '')
  }

  getAzureSearchUrl(): string {
    return this.get('AZURE_SEARCH_URL', '')
  }

  getAzureStroageConnectionString(): string {
    return this.get('AZURE_STORAGE_CONNECTION_STRING', '')
  }

  getSmsKey() {
    return this.get('SMS_KEY', '')
  }

  getJwtExpiresIn(): string | number | undefined {
    return this.get('JWT_EXPIRES_IN', '1d')
  }

  getJwtSecret(): string {
    return this.get('JWT_SECRET', '')
  }

  getCookieSecret() {
    return this.get('COOKIE_SECRET', Math.random() * 100000 + '')
  }

  getServiceBusConnectionString(): string | null {
    return this.get('AZURE_SERVICEBUS_CONN_STRING', '')
  }

  getAzureMapsKey() {
    return this.get('AZURE_MAPS_KEY', '')
  }
}
