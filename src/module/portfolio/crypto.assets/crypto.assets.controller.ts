'use strict';

import { Request, Response } from 'express';
import { helper } from '../../../helpers/helper';
import { variable } from './crypto.assets.variable';
import { response } from '../../../helpers/response';
import { repository } from './crypto.assets.repository';
import { transformer } from './crypto.assets.transformer';
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
  broker: 'Selling Agent',
  coin_name: 'Coin Name',
  coin_amount: 'Coin Amount',
  currency: 'Currency',
  purchase_value: 'Puchase Value',
  current_value: 'Current Value',
};

export default class Controller {
  public async list(req: Request, res: Response) {
    try {
      const { role_name, client_id } = req?.user;
      const clientId: any = req?.query?.client;

      let condition: any = {};
      if (clientId != undefined) condition = { crypto_assets_holder: clientId };
      else if (![ROLE_ADMIN, ROLE_AGENT].includes(role_name))
        condition = { crypto_assets_holder: client_id };

      const result = await repository.list(condition);
      if (result?.length < 1)
        return response.success(NOT_FOUND, null, res, false);
      const cryptoAssets = await transformer.list(result);
      return response.success(SUCCESS_RETRIEVED, cryptoAssets, res);
    } catch (err: any) {
      return helper.catchError(
        `crypto assets all-data: ${err?.message}`,
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
      if (clientId != undefined) condition = { crypto_assets_holder: clientId };
      else if (![ROLE_ADMIN, ROLE_AGENT].includes(role_name))
        condition = { crypto_assets_holder: client_id };

      const { count, rows } = await repository.index({
        ...query,
        condition: condition,
        role_name: role_name,
      });
      if (rows?.length < 1)
        return response.success(NOT_FOUND, null, res, false);
      const cryptoAssets = await transformer.list(rows);
      return response.success(
        SUCCESS_RETRIEVED,
        { total: count, values: cryptoAssets },
        res
      );
    } catch (err: any) {
      return helper.catchError(
        `crypto assets index: ${err?.message}`,
        500,
        res
      );
    }
  }

  public async detail(req: Request, res: Response) {
    try {
      const id: string = req?.params?.id || '';
      const result: Object | any = await repository.detail({
        crypto_assets_id: id,
      });
      if (!result) return response.success(NOT_FOUND, null, res, false);
      const cryptoAssets = await transformer.detail(result);
      return response.success(SUCCESS_RETRIEVED, cryptoAssets, res);
    } catch (err: any) {
      return helper.catchError(
        `crypto assets detail: ${err?.message}`,
        500,
        res
      );
    }
  }

  public async create(req: Request, res: Response) {
    try {
      const data: Object = helper.only(variable.fillable(), req?.body);
      await repository.create({
        payload: {
          ...data,
          created_by: req?.user?.id,
        },
      });

      return response.success(SUCCESS_SAVED, null, res);
    } catch (err: any) {
      return helper.catchError(
        `crypto assets create: ${err?.message}`,
        500,
        res
      );
    }
  }

  public async update(req: Request, res: Response) {
    try {
      const id: string = req?.params?.id || '';
      const check = await repository.detail({ crypto_assets_id: id });
      if (!check) return response.success(NOT_FOUND, null, res, false);

      const data: Object = helper.only(variable.fillable(), req?.body, true);
      await repository.update({
        payload: {
          ...data,
          modified_by: req?.user?.id,
        },
        condition: { crypto_assets_id: id },
      });
      return response.success(SUCCESS_UPDATED, null, res);
    } catch (err: any) {
      return helper.catchError(
        `crypto assets update: ${err?.message}`,
        500,
        res
      );
    }
  }

  public async delete(req: Request, res: Response) {
    try {
      const id: string = req?.params?.id || '';
      const date: string = helper.date();
      const check = await repository.detail({ crypto_assets_id: id });
      if (!check) return response.success(NOT_FOUND, null, res, false);
      await repository.update({
        payload: {
          status: 9,
          modified_by: req?.user?.id,
          modified_date: date,
        },
        condition: { crypto_assets_id: id },
      });
      return response.success(SUCCESS_DELETED, null, res);
    } catch (err: any) {
      return helper.catchError(
        `crypto assets delete: ${err?.message}`,
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
      if (clientId != undefined) condition = { crypto_assets_holder: clientId };
      else if (![ROLE_ADMIN, ROLE_AGENT].includes(role_name))
        condition = { crypto_assets_holder: client_id };

      const result = await repository.list(condition);
      if (result?.length < 1)
        return response.success(NOT_FOUND, null, res, false);
      const cryptoAssets = await transformer.list(result);

      if (type == 'excel') {
        const excel = await hExport.excel(
          { name: 'CRYPTO-ASSETS', start: 'A', end: 'H', keys: keyExport },
          cryptoAssets
        );
        return response.success(excel?.message, excel?.url, res, excel?.status);
      } else {
        const pdf = await hExport.pdf(
          { name: 'CRYPTO-ASSETS', keys: keyExport },
          cryptoAssets
        );
        return response.success(pdf?.message, pdf?.url, res, pdf?.status);
      }
    } catch (err: any) {
      return helper.catchError(
        `crypto assets ${type}: ${err?.message}`,
        500,
        res
      );
    }
  }
}

export const cryptoassets = new Controller();
