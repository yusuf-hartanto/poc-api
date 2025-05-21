'use strict';

import { Op } from 'sequelize';
import Model from './crypto.assets.model';
import Client from '../../insurance/client/client.model';
import { ROLE_CLIENT } from '../../../utils/constant';

export default class Repository {
  public list(condition: any) {
    return Model.findAll({
      where: {
        ...condition,
        status: { [Op.ne]: 9 },
      },
      order: [['created_date', 'DESC']],
      include: [
        {
          model: Client,
          attributes: [
            'id',
            'cin',
            'name',
            'dob',
            'age',
            'contact_number',
            'address',
            'email',
          ],
          as: 'holder',
          required: false,
        },
      ],
    });
  }

  public index(data: any) {
    let requiredClient = false;
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
      if (data?.role_name && data?.role_name != ROLE_CLIENT) {
        requiredClient = true;
      }
      query = {
        ...query,
        where: {
          ...data?.condition,
          status: { [Op.ne]: 9 },
          [Op.and]: [
            ...(data?.condition[Op.and] ? data?.condition[Op.and] : []),
            {
              [Op.or]: [
                { crypto_assets_name: { [Op.like]: `%${data?.keyword}%` } },
                { '$holder.name$': { [Op.like]: `%${data?.keyword}%` } },
              ],
            },
          ],
        },
      };
    }
    return Model.findAndCountAll({
      ...query,
      include: [
        {
          model: Client,
          attributes: [
            'id',
            'cin',
            'name',
            'dob',
            'age',
            'contact_number',
            'address',
            'email',
          ],
          as: 'holder',
          required: requiredClient,
        },
      ],
    });
  }

  public detail(condition: any) {
    return Model.findOne({
      where: {
        ...condition,
        status: { [Op.ne]: 9 },
      },
      include: [
        {
          model: Client,
          attributes: [
            'id',
            'cin',
            'name',
            'dob',
            'age',
            'contact_number',
            'address',
            'email',
          ],
          as: 'holder',
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

  public delete(data: any) {
    return Model.destroy({
      where: data?.condition,
    });
  }
}

export const repository = new Repository();
