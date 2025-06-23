'use strict';

import { Request, Response } from 'express';
import { helper } from '../../../helpers/helper';
import { response } from '../../../helpers/response';
import { appConfig } from '../../../config/config.app';
import { variable } from './watches.jeweleries.variable';
import { repository } from './watches.jeweleries.repository';
import { transformer } from './watches.jeweleries.transformer';
import {
  NOT_FOUND,
  ROLE_ADMIN,
  ROLE_AGENT,
  SUCCESS_DELETED,
  SUCCESS_RETRIEVED,
  SUCCESS_SAVED,
  SUCCESS_UPDATED,
} from '../../../utils/constant';
import { hExport } from '../../../helpers/export';
const keyExport: any = {
  no: 'No',
  holder_name: 'Holder',
  type: 'Type',
  watches_jeweleries_name: 'Name',
  brand: 'Brand',
  currency: 'Currency',
  purchase_value: 'Purchase Value',
  current_value: 'Current Value',
};

const uploadImages = async (req: Request) => {
  if (req?.files && req?.files?.images) {
    const images = req?.files?.images;
    let dataFiles: Array<String> = [];
    if (images?.length > 0) {
      for (const i in images) {
        let checkFile = helper.checkExtention(images[i]);
        if (checkFile == 'allowed') {
          const path_image = await helper.upload(
            images[i],
            'watches_jeweleries',
            req?.user?.username,
            appConfig?.assetType
          );
          dataFiles.push(path_image);
        }
      }
    } else {
      let checkFile = helper.checkExtention(images);
      if (checkFile == 'allowed') {
        const path_image = await helper.upload(
          images,
          'watches_jeweleries',
          req?.user?.username,
          appConfig?.assetType
        );
        dataFiles.push(path_image);
      }
    }

    if (dataFiles?.length > 0) return dataFiles.join(',');
    else return null;
  }
};

export default class Controller {
  public async list(req: Request, res: Response) {
    try {
      const { role_name, client_id } = req?.user;
      const clientId: any = req?.query?.client;

      let condition: any = {};
      if (clientId != undefined)
        condition = { watches_jeweleries_holder: clientId };
      else if (![ROLE_ADMIN, ROLE_AGENT].includes(role_name))
        condition = { watches_jeweleries_holder: client_id };

      const result = await repository.list(condition);
      if (result?.length < 1)
        return response.success(NOT_FOUND, null, res, false);
      const watchesJeweleries = await transformer.list(result);
      return response.success(SUCCESS_RETRIEVED, watchesJeweleries, res);
    } catch (err: any) {
      return helper.catchError(
        `watches jeweleries all-data: ${err?.message}`,
        500,
        res
      );
    }
  }

  public async index(req: Request, res: Response) {
    try {
      const { role_name, client_id } = req?.user;
      const clientId: any = req?.query?.client;
      const query = helper.fetchQueryIndex(req);

      let condition: any = {};
      if (clientId != undefined)
        condition = { watches_jeweleries_holder: clientId };
      else if (![ROLE_ADMIN, ROLE_AGENT].includes(role_name))
        condition = { watches_jeweleries_holder: client_id };

      const { count, rows } = await repository.index({
        ...query,
        condition: condition,
        role_name: role_name,
      });
      if (rows?.length < 1)
        return response.success(NOT_FOUND, null, res, false);
      const watchesJeweleries = await transformer.list(rows);
      return response.success(
        SUCCESS_RETRIEVED,
        { total: count, values: watchesJeweleries },
        res
      );
    } catch (err: any) {
      return helper.catchError(
        `watches jeweleries index: ${err?.message}`,
        500,
        res
      );
    }
  }

  public async detail(req: Request, res: Response) {
    try {
      const id: string = req?.params?.id || '';
      const result: Object | any = await repository.detail({
        watches_jeweleries_id: id,
      });
      if (!result) return response.success(NOT_FOUND, null, res, false);
      const watchesJeweleries = await transformer.detail(result);
      return response.success(SUCCESS_RETRIEVED, watchesJeweleries, res);
    } catch (err: any) {
      return helper.catchError(
        `watches jeweleries detail: ${err?.message}`,
        500,
        res
      );
    }
  }

  public async create(req: Request, res: Response) {
    try {
      const docLocation: any = await uploadImages(req);
      const data: Object = helper.only(variable.fillable(), req?.body);
      await repository.create({
        payload: {
          ...data,
          doc_location: docLocation,
          created_by: req?.user?.id,
        },
      });

      return response.success(SUCCESS_SAVED, null, res);
    } catch (err: any) {
      return helper.catchError(
        `watches jeweleries create: ${err?.message}`,
        500,
        res
      );
    }
  }

  public async update(req: Request, res: Response) {
    try {
      const id: string = req?.params?.id || '';
      const check = await repository.detail({ watches_jeweleries_id: id });
      if (!check) return response.success(NOT_FOUND, null, res, false);

      const docLocation: any = await uploadImages(req);
      const data: Object = helper.only(variable.fillable(), req?.body, true);
      await repository.update({
        payload: {
          ...data,
          doc_location: docLocation || check?.getDataValue('doc_location'),
          modified_by: req?.user?.id,
        },
        condition: { watches_jeweleries_id: id },
      });
      return response.success(SUCCESS_UPDATED, null, res);
    } catch (err: any) {
      return helper.catchError(
        `watches jeweleries update: ${err?.message}`,
        500,
        res
      );
    }
  }

  public async delete(req: Request, res: Response) {
    try {
      const id: string = req?.params?.id || '';
      const date: string = helper.date();
      const check = await repository.detail({ watches_jeweleries_id: id });
      if (!check) return response.success(NOT_FOUND, null, res, false);
      await repository.update({
        payload: {
          status: 9,
          modified_by: req?.user?.id,
          modified_date: date,
        },
        condition: { watches_jeweleries_id: id },
      });
      return response.success(SUCCESS_DELETED, null, res);
    } catch (err: any) {
      return helper.catchError(
        `watches jeweleries delete: ${err?.message}`,
        500,
        res
      );
    }
  }

  public async export(req: Request, res: Response) {
    const type: any = req?.params?.type || '';
    const { role_name, client_id } = req?.user;
    const clientId: any = req?.query?.client;

    try {
      let condition: any = {};
      if (clientId != undefined)
        condition = { watches_jeweleries_holder: clientId };
      else if (![ROLE_ADMIN, ROLE_AGENT].includes(role_name))
        condition = { watches_jeweleries_holder: client_id };

      const result = await repository.list(condition);
      if (result?.length < 1)
        return response.success(NOT_FOUND, null, res, false);
      const watchesJeweleries = await transformer.list(result);

      if (type == 'excel') {
        const excel = await hExport.excel(
          { name: 'WATCHES-JEWELERIES', start: 'A', end: 'H', keys: keyExport },
          watchesJeweleries
        );
        return response.success(excel?.message, excel?.url, res, excel?.status);
      } else {
        const pdf = await hExport.pdf(
          { name: 'WATCHES-JEWELERIES', keys: keyExport },
          watchesJeweleries
        );
        return response.success(pdf?.message, pdf?.url, res, pdf?.status);
      }
    } catch (err: any) {
      return helper.catchError(
        `watches jeweleries ${type}: ${err?.message}`,
        500,
        res
      );
    }
  }
}

export const watchesjeweleries = new Controller();
