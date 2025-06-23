'use strict';

import { repository as repoCurr } from '../../currency/currency.repository';

export default class Transformer {
  public async list(data: any) {
    let result: Array<object> = [];
    for (const i in data) {
      let cryptoAssets: any = data[i]?.dataValues;

      let rateCurr = 1;
      let currentValueCurr = parseFloat(cryptoAssets?.current_value);
      const curr = cryptoAssets?.currency;
      if (curr && curr != 'IDR') {
        const rate = await repoCurr.detail({ base: curr, key: 'IDR' });
        if (rate) {
          rateCurr = parseFloat(rate?.getDataValue('value'));
          currentValueCurr = rateCurr * currentValueCurr;
        }
      }

      cryptoAssets.holder_name = cryptoAssets?.holder?.name || '';
      result.push({
        ...cryptoAssets,
        currency_rate: rateCurr,
        currency_total: currentValueCurr,
      });
    }
    return result;
  }

  public async detail(data: any) {
    const forex = data?.dataValues;
    let result: any = forex;

    let rateCurr = 1;
    let currentValueCurr = parseFloat(forex?.current_value);
    const curr = forex?.currency;
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
