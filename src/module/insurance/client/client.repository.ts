'use strict';

import { Op } from 'sequelize';
import Model from './client.model';
import AppResource from '../../app/resource/resource.model';

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
    let condition = {};
    if (data?.relation && data?.relation != undefined) {
      condition = {
        id: data?.relation,
      };
    } else {
      if (data?.agent_id && data?.agent_id != undefined) {
        condition = {
          ...condition,
          agent_id: data?.agent_id,
        };
      } else {
        condition = {
          relation_id: '00000000-0000-0000-0000-000000000000',
        };
      }
    }
    if (data?.flag_client && data?.flag_client != undefined) {
      condition = {
        ...condition,
        flag_client: data?.flag_client,
      };
    }

    let query: Object = {
      where: {
        ...condition,
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
          ...condition,
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
      include: [
        {
          model: AppResource,
          attributes: [
            'resource_id',
            'email',
            'full_name',
            'telepon',
            'client_id',
          ],
          as: 'resource',
        },
      ],
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

export const repository = new Repository();
