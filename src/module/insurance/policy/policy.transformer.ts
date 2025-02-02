'use strict';

import { currency } from '../../currency/currency.controller';
import { repository as repoCurr } from '../../currency/currency.repository';

export default class Transformer {
  public async list(data: any) {
    let result: Array<object> = [];
    for (let i in data) {
      let rateCurr = 1;
      let premiValue = parseFloat(data[i]?.dataValues?.premi_value);
      const curr = data[i]?.dataValues?.premi_currency;
      if (curr != 'IDR') {
        const rate = await repoCurr.detail({ base: curr, key: 'IDR' });
        if (rate) {
          rateCurr = parseFloat(rate?.getDataValue('value'));
          premiValue = rateCurr * premiValue;
        }
      }

      result.push({
        ...data[i]?.dataValues,
        total_premi: premiValue,
        currency_value: rateCurr,
      });
    }
    return result;
  }

  public async detail(data: any) {
    let rateCurr = 1;
    let premiValue = parseFloat(data?.dataValues?.premi_value);
    const curr = data?.dataValues?.premi_currency;
    if (curr != 'IDR') {
      const rate = await repoCurr.detail({ base: curr, key: 'IDR' });
      if (rate) {
        rateCurr = parseFloat(rate?.getDataValue('value'));
        premiValue = rateCurr * premiValue;
      }
    }

    return {
      total_premi: premiValue,
      currency_value: rateCurr,
      ...data?.dataValues,
    };
  }
}

export const transformer = new Transformer();
