'use strict';

import { repository as repoCurr } from '../../currency/currency.repository';

export default class Transformer {
  public async list(data: any) {
    let result: Array<object> = [];
    for (const i in data) {
      let collectibles: any = data[i]?.dataValues;

      let rateCurr = 1;
      let currentValueCurr = parseFloat(collectibles?.current_value);
      const curr = collectibles?.currency;
      if (curr && curr != 'IDR') {
        const rate = await repoCurr.detail({ base: curr, key: 'IDR' });
        if (rate) {
          rateCurr = parseFloat(rate?.getDataValue('value'));
          currentValueCurr = rateCurr * currentValueCurr;
        }
      }

      collectibles.holder_name = collectibles?.holder?.name || '';
      result.push({
        ...collectibles,
        currency_rate: rateCurr,
        currency_total: currentValueCurr,
      });
    }
    return result;
  }

  public async detail(data: any) {
    const collectibles = data?.dataValues;
    let result: any = collectibles;

    let rateCurr = 1;
    let currentValueCurr = parseFloat(collectibles?.current_value);
    const curr = collectibles?.currency;
    if (curr && curr != 'IDR') {
      const rate = await repoCurr.detail({ base: curr, key: 'IDR' });
      if (rate) {
        rateCurr = parseFloat(rate?.getDataValue('value'));
        currentValueCurr = rateCurr * currentValueCurr;
      }
    }

    result.holder_name = result?.holder?.name || '';
    return {
      ...result,
      currency_rate: rateCurr,
      currency_total: currentValueCurr,
    };
  }
}

export const transformer = new Transformer();
