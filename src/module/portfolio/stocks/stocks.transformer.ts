'use strict';

import { repository as repoCurr } from '../../currency/currency.repository';

export default class Transformer {
  public async list(data: any) {
    let result: Array<object> = [];
    for (let i in data) {
      let stocks: any = data[i]?.dataValues;

      let rateCurr = 1;
      let currentValueCurr = parseFloat(stocks?.current_value);
      const curr = stocks?.currency;
      if (curr && curr != 'IDR') {
        const rate = await repoCurr.detail({ base: curr, key: 'IDR' });
        if (rate) {
          rateCurr = parseFloat(rate?.getDataValue('value'));
          currentValueCurr = rateCurr * currentValueCurr;
        }
      }

      result.push({
        ...stocks,
        currency_rate: rateCurr,
        currency_total: currentValueCurr,
      });
    }
    return result;
  }

  public async detail(data: any) {
    const stocks = data?.dataValues;
    let result: any = stocks;

    let rateCurr = 1;
    let currentValueCurr = parseFloat(stocks?.current_value);
    const curr = stocks?.currency;
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
      currency_total: currentValueCurr,
    };
  }
}

export const transformer = new Transformer();
