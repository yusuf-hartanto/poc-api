'use strict';

import { repository as repoCurr } from '../../currency/currency.repository';

export default class Transformer {
  public async list(data: any) {
    let result: Array<object> = [];
    for (let i in data) {
      let mutualFunds: any = data[i]?.dataValues;

      let rateCurr = 1;
      let currentValueCurr = parseFloat(mutualFunds?.current_value);
      const curr = mutualFunds?.currency;
      if (curr && curr != 'IDR') {
        const rate = await repoCurr.detail({ base: curr, key: 'IDR' });
        if (rate) {
          rateCurr = parseFloat(rate?.getDataValue('value'));
          currentValueCurr = rateCurr * currentValueCurr;
        }
      }

      result.push({
        ...mutualFunds,
        currency_rate: rateCurr,
        currency_purchase: currentValueCurr,
      });
    }
    return result;
  }

  public async detail(data: any) {
    const mutualFunds = data?.dataValues;
    let result: any = mutualFunds;

    let rateCurr = 1;
    let currentValueCurr = parseFloat(mutualFunds?.current_value);
    const curr = mutualFunds?.currency;
    if (curr && curr != 'IDR') {
      const rate = await repoCurr.detail({ base: curr, key: 'IDR' });
      if (rate) {
        rateCurr = parseFloat(rate?.getDataValue('value'));
        currentValueCurr = rateCurr * currentValueCurr;
      }
    }

    return {
      ...result,
      currency_rate: rateCurr,
      currency_purchase: currentValueCurr,
    };
  }
}

export const transformer = new Transformer();
