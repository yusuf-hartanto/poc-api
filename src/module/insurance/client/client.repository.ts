'use strict';

import { Op } from 'sequelize';
import Model from './client.model';

export default class Respository {
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
                { cin: { [Op.like]: `%${data?.keyword}%` } },
                { name: { [Op.like]: `%${data?.keyword}%` } },
                { address: { [Op.like]: `%${data?.keyword}%` } },
              ],
            },
          ],
        },
      };
    }
    return Model.findAndCountAll(query);
  }

  public relation(data: any) {
    let relation = {};
    if (data?.relation && data?.relation != undefined) {
      relation = {
        id: data?.relation,
      };
    } else {
      relation = {
        relation_id: '00000000-0000-0000-0000-000000000000',
      };
    }

    let query: Object = {
      where: {
        ...relation,
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
          ...relation,
          status: { [Op.ne]: 9 },
          [Op.or]: [
            { cin: { [Op.like]: `%${data?.keyword}%` } },
            { name: { [Op.like]: `%${data?.keyword}%` } },
            { address: { [Op.like]: `%${data?.keyword}%` } },
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

  public getLastCin() {
    return Model.findOne({
      order: [['cin', 'DESC']],
    });
  }

  public detailSurvey(condition: any) {
    return Model.findOne({
      attributes: [
        'id',
        'cin',
        'name',
        'dob',
        'age',
        'contact_number',
        'address',
      ],
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
export const repository = new Respository();
