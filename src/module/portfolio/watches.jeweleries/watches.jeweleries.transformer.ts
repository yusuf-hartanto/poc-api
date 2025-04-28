'use strict';

import { repository as repoCurr } from '../../currency/currency.repository';

export default class Transformer {
  public async list(data: any) {
    let result: Array<object> = [];
    for (let i in data) {
      let watchesJeweleries: any = data[i]?.dataValues;

      let rateCurr = 1;
      let purchaseCurr = parseFloat(watchesJeweleries?.purchase_value);
      const curr = watchesJeweleries?.currency;
      if (curr && curr != 'IDR') {
        const rate = await repoCurr.detail({ base: curr, key: 'IDR' });
        if (rate) {
          rateCurr = parseFloat(rate?.getDataValue('value'));
          purchaseCurr = rateCurr * purchaseCurr;
        }
      }

      result.push({
        ...watchesJeweleries,
        currency_rate: rateCurr,
        currency_total: purchaseCurr,
        doc_location: watchesJeweleries?.doc_location
          ? watchesJeweleries?.doc_location.split(',')
          : null,
      });
    }
    return result;
  }

  public async detail(data: any) {
    const watchesJeweleries = data?.dataValues;
    let result: any = watchesJeweleries;

    let rateCurr = 1;
    let purchaseCurr = parseFloat(watchesJeweleries?.purchase_value);
    const curr = watchesJeweleries?.currency;
    if (curr && curr != 'IDR') {
      const rate = await repoCurr.detail({ base: curr, key: 'IDR' });
      if (rate) {
        rateCurr = parseFloat(rate?.getDataValue('value'));
        purchaseCurr = rateCurr * purchaseCurr;
      }
    }

    return {
      ...result,
      currency_rate: rateCurr,
      currency_total: purchaseCurr,
      doc_location: watchesJeweleries?.doc_location
        ? watchesJeweleries?.doc_location.split(',')
        : null,
    };
  }
}

export const transformer = new Transformer();
