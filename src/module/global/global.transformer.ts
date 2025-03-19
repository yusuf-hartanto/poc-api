'use strict';

import { repository as repoCurr } from '../currency/currency.repository';

interface Summary {
  total_premi: number;
  up_jiwa: number;
  rs: number;
  penyakit_kritis: number;
  pensiun: number;
  dijamin: number;
}

export default class Transformer {
  public list(data: any) {
    return data.map((item: any) => ({
      id: item?.id,
      category_name: item?.category_name,
      title: item?.title,
      slug: item?.slug,
      description: item?.description,
      path_thumbnail: item?.path_thumbnail,
      path_image: item?.path_image,
      status: item?.status,
      counter_view: item?.counter_view,
      counter_share: item?.counter_share,
      counter_like: item?.counter_like,
      counter_comment: item?.counter_comment,
      created_by: item?.created_by,
      created_date: item?.created_date,
      modified_by: item?.modified_by,
      modified_date: item?.modified_date,
      like: item?.user_like > 0,
      author: {
        resource_id: item?.created_by,
        username: item?.username,
        full_name: item?.full_name,
        image_foto: item?.image_foto,
      },
    }));
  }

  public async summary(jatuhTempo: any, benefit: any) {
    let result: Summary = {
      total_premi: 0,
      up_jiwa: 0,
      rs: 0,
      penyakit_kritis: 0,
      pensiun: 0,
      dijamin: 0,
    };

    for (let jt in jatuhTempo) {
      const data: any = jatuhTempo[jt]?.dataValues;

      let premiValue = parseFloat(data?.premi_value);
      const curr = data?.premi_currency;
      if (curr && curr != 'IDR') {
        const rate = await repoCurr.detail({ base: curr, key: 'IDR' });
        if (rate)
          premiValue = parseFloat(rate?.getDataValue('value')) * premiValue;
      }
      result.total_premi += premiValue;
    }

    for (let b in benefit) {
      const dataBenefit: any = benefit[b]?.dataValues;

      let rateCurr = 1;
      const curr = dataBenefit?.premi_currency;
      if (curr && curr != 'IDR') {
        const rate = await repoCurr.detail({ base: curr, key: 'IDR' });
        if (rate) rateCurr = parseFloat(rate?.getDataValue('value'));
      }

      if (dataBenefit?.detail?.length > 0) {
        for (let d in dataBenefit?.detail) {
          const detail: any = dataBenefit?.detail[d]?.dataValues;
          if (detail?.benefit == 'up_jiwa') {
            result.up_jiwa += parseFloat(detail?.cash_value) * rateCurr;
          } else if (detail?.benefit == 'rs') {
            result.rs += parseFloat(detail?.cash_value) * rateCurr;
          } else if (detail?.benefit == 'penyakit_kritis') {
            result.penyakit_kritis += parseFloat(detail?.cash_value) * rateCurr;
          } else if (detail?.benefit == 'pensiun') {
            result.pensiun += parseFloat(detail?.cash_value) * rateCurr;
          } else if (detail?.benefit == 'dijamin') {
            result.dijamin += parseFloat(detail?.cash_value) * rateCurr;
          }
        }
      }
    }

    return result;
  }
}

export const transformer = new Transformer();
