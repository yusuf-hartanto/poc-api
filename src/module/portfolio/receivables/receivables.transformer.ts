'use strict';

import { repository as repoCurr } from '../../currency/currency.repository';

export default class Transformer {
  public async list(data: any) {
    let result: Array<object> = [];
    for (let i in data) {
      let receivables: any = data[i]?.dataValues;

      let rateCurr = 1;
      let amountCurr = parseFloat(receivables?.total_receivable_amount);
      const curr = receivables?.currency;
      if (curr && curr != 'IDR') {
        const rate = await repoCurr.detail({ base: curr, key: 'IDR' });
        if (rate) {
          rateCurr = parseFloat(rate?.getDataValue('value'));
          amountCurr = rateCurr * amountCurr;
        }
      }

      result.push({
        ...receivables,
        currency_rate: rateCurr,
        currency_total: amountCurr,
        doc_location: receivables?.doc_location
          ? receivables?.doc_location.split(',')
          : null,
      });
    }
    return result;
  }

  public async detail(data: any) {
    const receivables = data?.dataValues;
    let result: any = receivables;

    let rateCurr = 1;
    let amountCurr = parseFloat(receivables?.total_receivable_amount);
    const curr = receivables?.currency;
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
      doc_location: receivables?.doc_location
        ? receivables?.doc_location.split(',')
        : null,
    };
  }
}

export const transformer = new Transformer();
