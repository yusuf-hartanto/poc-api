'use strict';

import { Op } from 'sequelize';
import Model from './policy.model';
import Detail from './policy.detail.model';

export default class Respository {
  public list() {
    return Model.findAll({
      where: { status: { [Op.ne]: 9 } },
      order: [['created_date', 'DESC']],
      include: [
        {
          model: Detail,
          as: 'detail',
          required: false,
        },
      ],
    });
  }

  public index(data: any) {
    let query: Object = {
      where: { status: { [Op.ne]: 9 } },
      order: [['created_date', 'DESC']],
      offset: data?.offset,
      limit: data?.limit,
    };
    if (data?.keyword !== undefined && data?.keyword != null) {
      query = {
        ...query,
        where: {
          status: { [Op.ne]: 9 },
          [Op.or]: [
            { provider_company: { [Op.like]: `%${data?.keyword}%` } },
            { product_name: { [Op.like]: `%${data?.keyword}%` } },
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
      include: [
        {
          model: Detail,
          as: 'detail',
          required: false,
        },
      ],
    });
  }

  public findDetail(condition: any) {
    return Detail.findAll({
      where: condition,
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

  public createDetail(data: any) {
    return Detail.create(data?.payload);
  }

  public bulkCreate(data: any) {
    return Detail.bulkCreate(data?.payload);
  }

  public updateDetail(data: any) {
    return Detail.update(data?.payload, {
      where: data?.condition,
    });
  }

  public deleteDetail(data: any) {
    return Detail.destroy({
      where: data?.condition,
    });
  }
}
export const repository = new Respository();
