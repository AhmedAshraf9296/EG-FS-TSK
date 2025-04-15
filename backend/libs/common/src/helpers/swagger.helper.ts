import { NestFastifyApplication } from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { swaggerCustomCss, swaggerCustomJs } from './swaggertheme.helper'

export function addSwaggerDocsToServer(
  app: NestFastifyApplication,
  options: {
    globalPrefix?: string
    servers?: { url: string; description: string }[]
    port: number
  },
) {
  const swaggerDoc = new DocumentBuilder()
    .setTitle('Easy Generator Full Stack Task')
    .setDescription('Easy Generator Full Stack Documentation')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .addCookieAuth('authentication')
    .addSecurityRequirements('bearer')
    .addSecurityRequirements('cookie')

  for (const server of options?.servers ?? []) {
    swaggerDoc.addServer(server.url, server.description)
  }

  const swagger = swaggerDoc
    .addServer(`http://localhost:${options?.port}`, 'Local Env') // append at the end
    .build()

  const document = SwaggerModule.createDocument(app, swagger)
  SwaggerModule.setup(`${options?.globalPrefix ?? ''}/docs`, app, document, {
    jsonDocumentUrl: `${options?.globalPrefix ?? ''}/docs-json`,
    yamlDocumentUrl: `${options?.globalPrefix ?? ''}/docs-yaml`,
    customCss: swaggerCustomCss,
    customJsStr: swaggerCustomJs,
    customfavIcon: '',
    customSiteTitle: 'Easy Generator Full Stack',
    swaggerOptions: {
      defaultModelsExpandDepth: -1,
      displayOperationId: true,
      docExpansion: 'none',
    },
  })
}
