'use strict';

import { repository } from './client.repository';

const nestedChild = async (data: any) => {
  const client = await repository.list({
    relation_id: data?.id,
  });

  let result: Array<object> = [];
  if (client && client?.length > 0) {
    for (let i in client) {
      const child = await nestedChild(client[i]?.dataValues);

      const c: any = {
        ...client[i]?.dataValues,
        child,
      };
      result.push(c);
    }
  }
  return result;
};

export default class Transformer {
  public async relation(data: any) {
    let result: Array<object> = [];
    for (let i in data) {
      const child = await nestedChild(data[i]?.dataValues);

      const client: any = {
        ...data[i]?.dataValues,
        child,
      };
      result.push(client);
    }
    return result;
  }
}

export const transformer = new Transformer();
