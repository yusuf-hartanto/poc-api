'use strict';

import { repository } from './policy.respository';

export default class Transformer {
  public async list(data: any) {
    let result: Array<object> = [];
    for (let i in data) {
      const details = await repository.findDetail({
        policy_id: data[i]?.dataValues?.policy_id,
      });

      result.push({
        ...data[i]?.dataValues,
        detail: details?.map((d: any) => {
          return {
            ...d?.dataValues,
            benefit: d?.dataValues?.benefit
              ? JSON.parse(d?.dataValues?.benefit)
              : d?.dataValues?.benefit,
          };
        }),
      });
    }
    return result;
  }

  public async detail(data: any) {
    const details = await repository.findDetail({
      policy_id: data?.dataValues?.policy_id,
    });

    return {
      ...data?.dataValues,
      detail: details?.map((d: any) => {
        return {
          ...d?.dataValues,
          benefit: d?.dataValues?.benefit
            ? JSON.parse(d?.dataValues?.benefit)
            : d?.dataValues?.benefit,
        };
      }),
    };
  }
}

export const transformer = new Transformer();
