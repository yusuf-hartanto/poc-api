'use strict';

import { repository as repoCurr } from '../../currency/currency.repository';

export default class Transformer {
  public async list(data: any) {
    let result: Array<object> = [];
    for (let i in data) {
      let vehiclesMachineries: any = data[i]?.dataValues;

      let rateCurr = 1;
      let purchaseCurr = parseFloat(vehiclesMachineries?.purchase_value);
      const curr = vehiclesMachineries?.currency;
      if (curr && curr != 'IDR') {
        const rate = await repoCurr.detail({ base: curr, key: 'IDR' });
        if (rate) {
          rateCurr = parseFloat(rate?.getDataValue('value'));
          purchaseCurr = rateCurr * purchaseCurr;
        }
      }

      result.push({
        ...vehiclesMachineries,
        currency_rate: rateCurr,
        currency_total: purchaseCurr,
        doc_location: vehiclesMachineries?.doc_location
          ? vehiclesMachineries?.doc_location.split(',')
          : null,
      });
    }
    return result;
  }

  public async detail(data: any) {
    const vehiclesMachineries = data?.dataValues;
    let result: any = vehiclesMachineries;

    let rateCurr = 1;
    let purchaseCurr = parseFloat(vehiclesMachineries?.purchase_value);
    const curr = vehiclesMachineries?.currency;
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
      doc_location: vehiclesMachineries?.doc_location
        ? vehiclesMachineries?.doc_location.split(',')
        : null,
    };
  }
}

export const transformer = new Transformer();
