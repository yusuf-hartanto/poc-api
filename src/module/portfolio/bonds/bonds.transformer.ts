'use strict';

import { repository as repoCurr } from '../../currency/currency.repository';

export default class Transformer {
  public async list(data: any) {
    let result: Array<object> = [];
    for (const i in data) {
      let bonds: any = data[i]?.dataValues;

      let rateCurr = 1;
      let amountCurr = parseFloat(bonds?.amount);
      const curr = bonds?.currency;
      if (curr && curr != 'IDR') {
        const rate = await repoCurr.detail({ base: curr, key: 'IDR' });
        if (rate) {
          rateCurr = parseFloat(rate?.getDataValue('value'));
          amountCurr = rateCurr * amountCurr;
        }
      }

      bonds.holder_name = bonds?.holder?.name || '';
      result.push({
        ...bonds,
        currency_rate: rateCurr,
        currency_total: amountCurr,
      });
    }
    return result;
  }

  public async detail(data: any) {
    const bonds = data?.dataValues;
    let result: any = bonds;

    let rateCurr = 1;
    let amountCurr = parseFloat(bonds?.amount);
    const curr = bonds?.currency;
    if (curr && curr != 'IDR') {
      const rate = await repoCurr.detail({ base: curr, key: 'IDR' });
      if (rate) {
        rateCurr = parseFloat(rate?.getDataValue('value'));
        amountCurr = rateCurr * amountCurr;
      }
    }

    result.holder_name = result?.holder?.name || '';
    return {
      ...result,
      currency_rate: rateCurr,
      currency_total: amountCurr,
    };
  }
}

export const transformer = new Transformer();
