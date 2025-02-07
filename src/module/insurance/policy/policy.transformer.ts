'use strict';

import { Op } from 'sequelize';
import { repository as repoClient } from '../client/client.repository';
import { repository as repoCurr } from '../../currency/currency.repository';

export default class Transformer {
  public async list(data: any) {
    let result: Array<object> = [];
    for (let i in data) {
      const policy = data[i]?.dataValues;

      let rateCurr = 1;
      let premiValue = parseFloat(policy?.premi_value);
      const curr = policy?.premi_currency;
      if (curr != 'IDR') {
        const rate = await repoCurr.detail({ base: curr, key: 'IDR' });
        if (rate) {
          rateCurr = parseFloat(rate?.getDataValue('value'));
          premiValue = rateCurr * premiValue;
        }
      }

      const clients = await repoClient.list({
        id: {
          [Op.in]: [
            policy?.policy_holder,
            policy?.insured_holder,
            policy?.beneficiary_holder,
          ],
        },
      });

      result.push({
        ...policy,
        total_premi: premiValue,
        currency_value: rateCurr,
        policy_holder_name:
          clients.find(
            (c: any) => c?.getDataValue('id') == policy?.policy_holder
          )?.name || null,
        insured_holder_name:
          clients.find(
            (c: any) => c?.getDataValue('id') == policy?.insured_holder
          )?.name || null,
        beneficiary_holder_name:
          clients.find(
            (c: any) => c?.getDataValue('id') == policy?.beneficiary_holder
          )?.name || null,
      });
    }
    return result;
  }

  public async detail(data: any) {
    const policy = data?.dataValues;

    let rateCurr = 1;
    let premiValue = parseFloat(policy?.premi_value);
    const curr = policy?.premi_currency;
    if (curr != 'IDR') {
      const rate = await repoCurr.detail({ base: curr, key: 'IDR' });
      if (rate) {
        rateCurr = parseFloat(rate?.getDataValue('value'));
        premiValue = rateCurr * premiValue;
      }
    }

    const clients = await repoClient.list({
      id: {
        [Op.in]: [
          policy?.policy_holder,
          policy?.insured_holder,
          policy?.beneficiary_holder,
        ],
      },
    });

    return {
      ...policy,
      total_premi: premiValue,
      currency_value: rateCurr,
      policy_holder_name:
        clients.find((c: any) => c?.getDataValue('id') == policy?.policy_holder)
          ?.name || null,
      insured_holder_name:
        clients.find(
          (c: any) => c?.getDataValue('id') == policy?.insured_holder
        )?.name || null,
      beneficiary_holder_name:
        clients.find(
          (c: any) => c?.getDataValue('id') == policy?.beneficiary_holder
        )?.name || null,
    };
  }
}

export const transformer = new Transformer();
