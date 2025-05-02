'use strict';

import { Op } from 'sequelize';
import Model from './safe.deposit.box.model';

export default class Repository {
  public list(condition: any) {
    return Model.findAll({
      where: {
        ...condition,
        status: { [Op.ne]: 9 },
      },
      order: [['created_date', 'DESC']],
    });
  }

  public index(data: any) {
    let query: Object = {
      where: {
        ...data?.condition,
        status: { [Op.ne]: 9 },
      },
      order: [['created_date', 'DESC']],
      offset: data?.offset,
      limit: data?.limit,
    };
    if (data?.keyword && data?.keyword != undefined) {
      query = {
        ...query,
        where: {
          ...data?.condition,
          status: { [Op.ne]: 9 },
          [Op.and]: [
            ...(data?.condition[Op.and] ? data?.condition[Op.and] : []),
            {
              [Op.or]: [
                { name: { [Op.like]: `%${data?.keyword}%` } },
                { location: { [Op.like]: `%${data?.keyword}%` } },
              ],
            },
          ],
        },
      };
    }
    return Model.findAndCountAll(query);
  }

  public detail(condition: any) {
    return Model.findOne({
      where: {
        ...condition,
        status: { [Op.ne]: 9 },
      },
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

  public delete(data: any) {
    return Model.destroy({
      where: data?.condition,
    });
  }
}

export const repository = new Repository();
