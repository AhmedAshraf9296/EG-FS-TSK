import { Inject, Injectable, Logger } from '@nestjs/common'; <% if (crud && type !== 'graphql-code-first' && type !== 'graphql-schema-first') { %>
import { FindParams, ID } from '@db';
import { Pagination, PaginatedDto } from '@lib/common';
import { <%= classify(name) %>Repository } from './<%= lowercased(name) %>.repository';
import { Create<%= singular(classify(name)) %>Dto } from './dto/create-<%= singular(name) %>.dto';
import { Filter<%= singular(classify(name)) %>Dto } from './dto/filter-<%= singular(name) %>.dto';
import { Update<%= singular(classify(name)) %>Dto } from './dto/update-<%= singular(name) %>.dto';<% } else if (crud) { %>
import { Create<%= singular(classify(name)) %>Input } from './dto/create-<%= singular(name) %>.input';
import { Update<%= singular(classify(name)) %>Input } from './dto/update-<%= singular(name) %>.input';<% } %>
import { <%= singular(classify(name)) %> } from './entities/<%= singular(name) %>.entity';

@Injectable()
export class <%= classify(name) %>Service {<% if (crud) { %>
  private readonly logger = new Logger(<%= classify(name) %>Service.name);

  @Inject(<%= classify(name) %>Repository)
  private readonly <%= lowercased(classify(name)) %>Repository: <%= classify(name) %>Repository;

  create(<% if (type !== 'graphql-code-first' && type !== 'graphql-schema-first') { %>create<%= singular(classify(name)) %>Dto: Create<%= singular(classify(name)) %>Dto<% } else { %>create<%= singular(classify(name)) %>Input: Create<%= singular(classify(name)) %>Input<% } %>) {
    this.logger.debug('Creating a new <%= singular(name) %>');
    return this.<%= lowercased(classify(name)) %>Repository.create(<% if (type !== 'graphql-code-first' && type !== 'graphql-schema-first') { %>create<%= singular(classify(name)) %>Dto<% } else { %>create<%= singular(classify(name)) %>Input<% } %>);
  }

  async findAll(pagination: Pagination, filter: Filter<%= singular(classify(name)) %>Dto, select: FindParams<<%= singular(classify(name)) %>>['select']): Promise<PaginatedDto<<%= singular(classify(name)) %>>> {
    const filterOverrides = {}
    this.logger.debug('Finding all <%= lowercased(name) %>s');
    const [items, total] = await Promise.all([
      this.<%= lowercased(classify(name)) %>Repository.find({
        filter: filter.toJSON(filterOverrides),
        select: select,
        sort: pagination.sortKey,
        sortDirection: pagination.sortAsc,
        skip: pagination.skip,
        take: pagination.limit,
      }),
      this.<%= lowercased(classify(name)) %>Repository.count(filter.toJSON(filterOverrides))
    ])

    return {
      total,
      pages: Math.ceil(total / pagination.limit),
      items,
    }
  }

  findOne(id: ID, select: FindParams<<%= singular(classify(name)) %>>['select']) {
    this.logger.debug(`Finding <%= lowercased(singular(name)) %> with id: ${id}`);
    return this.<%= lowercased(classify(name)) %>Repository.findById(id, select);
  }

  update(id: ID, <% if (type !== 'graphql-code-first' && type !== 'graphql-schema-first') { %>update<%= singular(classify(name)) %>Dto: Update<%= singular(classify(name)) %>Dto<% } else { %>update<%= singular(classify(name)) %>Input: Update<%= singular(classify(name)) %>Input<% } %>) {
    this.logger.debug(`Updating <%= lowercased(singular(name)) %> with id: ${id}`);
    return this.<%= lowercased(classify(name)) %>Repository.updateById(id, <% if (type !== 'graphql-code-first' && type !== 'graphql-schema-first') { %>update<%= singular(classify(name)) %>Dto<% } else { %>update<%= singular(classify(name)) %>Input<% } %>);
  }

  remove(id: ID) {
    this.logger.debug(`Removing <%= lowercased(singular(name)) %> with id: ${id}`);
    return this.<%= lowercased(classify(name)) %>Repository.deleteById(id);
  }

  bulkRemove(ids: string[]) {
    this.logger.debug(`Removing <%= lowercased(singular(name)) %> with ids: ${ids}`);
    return this.<%= lowercased(classify(name)) %>Repository.deleteManyByIds(ids);
  }
<% } %>}

<%
// vim:set ft=template
%>
