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

const nestedChildOption = async (result: any, data: any) => {
  const client = await repository.list({
    relation_id: data?.id,
  });

  if (client && client?.length > 0) {
    for (let i in client) {
      result.push(client[i]?.dataValues);

      await nestedChildOption(result, client[i]?.dataValues);
    }
  }
  return result;
};

const nestedParentOption = async (result: any, data: any) => {
  const client = await repository.list({
    id: data?.relation_id,
  });

  if (client && client?.length > 0) {
    for (let i in client) {
      result.push(client[i]?.dataValues);

      await nestedParentOption(result, client[i]?.dataValues);
    }
  }
  return result;
};

export default class Transformer {
  public async list(data: any) {
    let result: Array<object> = [];
    for (let i in data) {
      let client: any = data[i]?.dataValues;

      let relation: any = null;
      if (
        client?.relation_id &&
        client?.relation_id != '00000000-0000-0000-0000-000000000000'
      ) {
        relation = await repository.detail({
          id: client?.relation_id,
        });
      }

      result.push({
        ...client,
        relation: relation,
      });
    }
    return result;
  }

  public async detail(data: any) {
    const client = data?.dataValues;
    let result: any = client;

    let relation: any = null;
    if (
      client?.relation_id &&
      client?.relation_id != '00000000-0000-0000-0000-000000000000'
    ) {
      relation = await repository.detail({
        id: client?.relation_id,
      });
    }

    return {
      ...result,
      relation: relation,
    };
  }

  public async relation(data: any, flag: any) {
    let result: Array<object> = [];
    for (let i in data) {
      if (flag && flag?.option == 1) {
        result.push(data[i]?.dataValues);

        await nestedParentOption(result, data[i]?.dataValues);
        await nestedChildOption(result, data[i]?.dataValues);
      } else {
        const child = await nestedChild(data[i]?.dataValues);

        const client: any = {
          ...data[i]?.dataValues,
          child,
        };
        result.push(client);
      }
    }
    return result;
  }
}

export const transformer = new Transformer();
