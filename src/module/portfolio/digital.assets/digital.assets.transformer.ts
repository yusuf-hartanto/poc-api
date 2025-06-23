'use strict';

import { repository as repoCurr } from '../../currency/currency.repository';

export default class Transformer {
  public async list(data: any) {
    let result: Array<object> = [];
    for (const i in data) {
      let digitalAssets: any = data[i]?.dataValues;

      let rateCurr = 1;
      let purchaseCurr = parseFloat(digitalAssets?.purchase_value);
      const curr = digitalAssets?.currency;
      if (curr && curr != 'IDR') {
        const rate = await repoCurr.detail({ base: curr, key: 'IDR' });
        if (rate) {
          rateCurr = parseFloat(rate?.getDataValue('value'));
          purchaseCurr = rateCurr * purchaseCurr;
        }
      }

      digitalAssets.holder_name = digitalAssets?.holder?.name || '';
      result.push({
        ...digitalAssets,
        currency_rate: rateCurr,
        currency_total: purchaseCurr,
        doc_location: digitalAssets?.doc_location
          ? digitalAssets?.doc_location.split(',')
          : null,
      });
    }
    return result;
  }

  public async detail(data: any) {
    const digitalAssets = data?.dataValues;
    let result: any = digitalAssets;

    let rateCurr = 1;
    let purchaseCurr = parseFloat(digitalAssets?.purchase_value);
    const curr = digitalAssets?.currency;
    if (curr && curr != 'IDR') {
      const rate = await repoCurr.detail({ base: curr, key: 'IDR' });
      if (rate) {
        rateCurr = parseFloat(rate?.getDataValue('value'));
        purchaseCurr = rateCurr * purchaseCurr;
      }
    }

    result.holder_name = digitalAssets?.holder?.name || '';
    return {
      ...result,
      currency_rate: rateCurr,
      currency_total: purchaseCurr,
      doc_location: digitalAssets?.doc_location
        ? digitalAssets?.doc_location.split(',')
        : null,
    };
  }
}

export const transformer = new Transformer();
