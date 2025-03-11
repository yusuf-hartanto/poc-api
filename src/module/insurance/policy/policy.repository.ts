'use strict';

import { Op } from 'sequelize';
import Model from './policy.model';
import Detail from './policy.detail.model';

export default class Respository {
  public list(data: any, withDetail: boolean = false, benefit: string = '') {
    let query: Object = {
      where: {
        ...data?.condition,
        status: { [Op.ne]: 9 },
      },
      order: [['created_date', 'DESC']],
    };
    if (data?.keyword && data?.keyword != undefined) {
      query = {
        ...query,
        where: {
          ...data?.condition,
          status: { [Op.ne]: 9 },
          [Op.or]: [
            { provider_company: { [Op.like]: `%${data?.keyword}%` } },
            { product_name: { [Op.like]: `%${data?.keyword}%` } },
          ],
        },
      };
    }
    if (withDetail) {
      let detailWhere = {};
      if (benefit) detailWhere = { where: { benefit: benefit } };

      query = {
        ...query,
        include: [
          {
            model: Detail,
            attributes: [
              'id',
              'policy_id',
              'cash_value',
              'benefit',
              'start_date',
              'end_date',
            ],
            as: 'detail',
            required: detailWhere ? true : false,
            ...detailWhere,
          },
        ],
        distinct: true,
      };
    }
    return Model.findAll(query);
  }

  public index(data: any, withDetail: boolean = false, benefit: string = '') {
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
          [Op.or]: [
            { provider_company: { [Op.like]: `%${data?.keyword}%` } },
            { product_name: { [Op.like]: `%${data?.keyword}%` } },
          ],
        },
      };
    }
    if (withDetail) {
      let detailWhere = {};
      if (benefit) detailWhere = { where: { benefit: benefit } };

      query = {
        ...query,
        include: [
          {
            model: Detail,
            attributes: [
              'id',
              'policy_id',
              'cash_value',
              'benefit',
              'start_date',
              'end_date',
            ],
            as: 'detail',
            required: detailWhere ? true : false,
            ...detailWhere,
          },
        ],
        distinct: true,
      };
    }
    return Model.findAndCountAll(query);
  }

  public detail(condition: any, benefit: string = '') {
    let detailWhere = {};
    if (benefit) detailWhere = { where: { benefit: benefit } };

    return Model.findOne({
      where: {
        ...condition,
        status: { [Op.ne]: 9 },
      },
      include: [
        {
          model: Detail,
          attributes: [
            'id',
            'policy_id',
            'cash_value',
            'benefit',
            'start_date',
            'end_date',
          ],
          as: 'detail',
          required: detailWhere ? true : false,
          ...detailWhere,
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
