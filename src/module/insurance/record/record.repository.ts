'use strict';

import { Op } from 'sequelize';
import Model from './record.model';
import Policy from '../policy/policy.model';
import Client from '../client/client.model';

export default class Repository {
  public list() {
    return Model.findAll({
      order: [['created_date', 'DESC']],
      include: [
        {
          model: Policy,
          as: 'policy',
          required: false,
        },
        {
          model: Client,
          as: 'client',
          required: false,
        },
      ],
    });
  }

  public index(data: any) {
    let query: Object = {
      order: [['created_date', 'DESC']],
      offset: data?.offset,
      limit: data?.limit,
    };
    if (data?.keyword && data?.keyword != undefined) {
      query = {
        ...query,
        where: {
          [Op.or]: [
            { menu_name: { [Op.like]: `%${data?.keyword}%` } },
            { module_name: { [Op.like]: `%${data?.keyword}%` } },
          ],
        },
      };
    }
    return Model.findAndCountAll({
      ...query,
      include: [
        {
          model: Policy,
          as: 'policy',
          required: false,
        },
        {
          model: Client,
          as: 'client',
          required: false,
        },
      ],
    });
  }

  public detail(condition: any) {
    return Model.findOne({
      where: condition,
      include: [
        {
          model: Policy,
          as: 'policy',
          required: false,
        },
        {
          model: Client,
          as: 'client',
          required: false,
        },
      ],
    });
  }

  public create(data: any) {
    return Model.create(data?.payload);
  }

  public update(data: any) {
    return Model.update(data?.payload, {
      where: data?.condition,
    });
  }
}

export const repository = new Repository();
