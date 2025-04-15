import { DynamicModule, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { <%= singular(classify(name)) %>Feature } from './entities/<%= singular(name) %>.entity';
<% if (type === 'rest' || type === 'microservice') { %>import { <%= classify(name) %>Controller } from './<%= name %>.controller';<% } %><% if (type === 'graphql-code-first' || type === 'graphql-schema-first') { %>import { <%= classify(name) %>Resolver } from './<%= name %>.resolver';<% } %><% if (type === 'ws') { %>import { <%= classify(name) %>Gateway } from './<%= name %>.gateway';<% } %>
import { <%= classify(name) %>Repository } from './<%= lowercased(name) %>.repository';
import { <%= classify(name) %>Service } from './<%= name %>.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      <%= singular(classify(name)) %>Feature
    ])
  ],
  providers: [<%= classify(name) %>Service, <%= classify(name) %>Repository ],
})
export class <%= classify(name) %>Module {
  // Only if used within an app export the service and repo to allow for injection
  static forRoot(options?: { controller?: boolean, repoOnly?: boolean }): DynamicModule {
    if (options?.controller) {
      return {
        module: <%= classify(name) %>Module,
        controllers: [<%= classify(name) %>Controller],
        providers: [<%= classify(name) %>Service, <%= classify(name) %>Repository],
        exports: [<%= classify(name) %>Service, <%= classify(name) %>Repository],
      }
    }
    if (options?.repoOnly) {
      return {
        module: <%= classify(name) %>Module,
        providers: [<%= classify(name) %>Repository],
        exports: [<%= classify(name) %>Repository],
      }
    }
    return {
      module: <%= classify(name) %>Module,
      providers: [<%= classify(name) %>Service, <%= classify(name) %>Repository],
      exports: [<%= classify(name) %>Service, <%= classify(name) %>Repository],
    }
  }
}

<%
// vim: set ft=template
%>
