'use strict';

import { repository as repoCurr } from '../../currency/currency.repository';

export default class Transformer {
  public async list(data: any) {
    let result: Array<object> = [];
    for (const i in data) {
      let sharesBusiness: any = data[i]?.dataValues;

      sharesBusiness.holder_name = sharesBusiness?.holder?.name || '';
      result.push({
        ...sharesBusiness,
        doc_location: sharesBusiness?.doc_location
          ? sharesBusiness?.doc_location.split(',')
          : null,
      });
    }
    return result;
  }

  public async detail(data: any) {
    const sharesBusiness = data?.dataValues;
    let result: any = sharesBusiness;

    result.holder_name = sharesBusiness?.holder?.name || '';
    return {
      ...result,
      doc_location: sharesBusiness?.doc_location
        ? sharesBusiness?.doc_location.split(',')
        : null,
    };
  }
}

export const transformer = new Transformer();
