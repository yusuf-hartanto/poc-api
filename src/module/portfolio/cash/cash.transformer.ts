'use strict';

import { repository as repoCurr } from '../../currency/currency.repository';

export default class Transformer {
  public async list(data: any) {
    let result: Array<object> = [];
    for (let i in data) {
      let cash: any = data[i]?.dataValues;

      let rateCurr = 1;
      let amountCurr = parseFloat(cash?.amount);
      const curr = cash?.currency;
      if (curr && curr != 'IDR') {
        const rate = await repoCurr.detail({ base: curr, key: 'IDR' });
        if (rate) {
          rateCurr = parseFloat(rate?.getDataValue('value'));
          amountCurr = rateCurr * amountCurr;
        }
      }

      result.push({
        ...cash,
        currency_rate: rateCurr,
        currency_total: amountCurr,
      });
    }
    return result;
  }

  public async detail(data: any) {
    const cash = data?.dataValues;
    let result: any = cash;

    let rateCurr = 1;
    let amountCurr = parseFloat(cash?.amount);
    const curr = cash?.currency;
    if (curr && curr != 'IDR') {
      const rate = await repoCurr.detail({ base: curr, key: 'IDR' });
      if (rate) {
        rateCurr = parseFloat(rate?.getDataValue('value'));
        amountCurr = rateCurr * amountCurr;
      }
    }

    return {
      ...result,
      currency_rate: rateCurr,
      currency_total: amountCurr,
    };
  }
}

export const transformer = new Transformer();
