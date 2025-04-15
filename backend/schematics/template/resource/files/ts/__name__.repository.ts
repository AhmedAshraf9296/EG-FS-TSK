import { Injectable, Logger } from '@nestjs/common';<% if (crud) { %>
import { AbstractRepository } from '@db/repositories/AbstractRepository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { <%= singular(classify(name)) %> } from './entities/<%= singular(name) %>.entity';

<% } %>

@Injectable()
export class <%= classify(name) %>Repository extends AbstractRepository< <%= singular(classify(name)) %> > {<% if (crud) { %>
  protected logger: Logger = new Logger(<%= classify(name) %>Repository.name)

  constructor(
    @InjectModel(<%= singular(classify(name)) %>.name) protected readonly model: Model< <%= singular(classify(name)) %> >,
  ) {
    super(model)
  }
<% } %>}

<%
// vim: set ft=template
%>

