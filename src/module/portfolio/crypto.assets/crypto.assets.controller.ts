'use strict';

import { Request, Response } from 'express';
import { helper } from '../../../helpers/helper';
import { variable } from './crypto.assets.variable';
import { response } from '../../../helpers/response';
import { repository } from './crypto.assets.repository';
import { transformer } from './crypto.assets.transformer';

export default class Controller {
  public async list(req: Request, res: Response) {
    try {
      const clientId: any = req?.query?.client;

      let condition: any = {};
      if (clientId != undefined) condition = { crypto_assets_holder: clientId };
      else if (!['administrator', 'agent'].includes(req?.user?.role_name))
        condition = { crypto_assets_holder: req?.user?.client_id };

      const result = await repository.list(condition);
      if (result?.length < 1)
        return response.success('Data not found', null, res, false);
      const cryptoAssets = await transformer.list(result);
      return response.success('list data crypto assets', cryptoAssets, res);
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
      const limit: any = req?.query?.perPage || 10;
      const offset: any = req?.query?.page || 1;
      const keyword: any = req?.query?.q;
      const clientId: any = req?.query?.client;

      let condition: any = {};
      if (clientId != undefined) condition = { crypto_assets_holder: clientId };
      else if (!['administrator', 'agent'].includes(req?.user?.role_name))
        condition = { crypto_assets_holder: req?.user?.client_id };

      const { count, rows } = await repository.index({
        limit: parseInt(limit),
        offset: parseInt(limit) * (parseInt(offset) - 1),
        keyword: keyword,
        condition: condition,
      });
      if (rows?.length < 1)
        return response.success('Data not found', null, res, false);
      const cryptoAssets = await transformer.list(rows);
      return response.success(
        'Data crypto assets',
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
      const id: string = req.params.id || '';
      if (!helper.isValidUUID(id))
        return response.failed(`id ${id} is not valid`, 400, res);

      const result: Object | any = await repository.detail({
        crypto_assets_id: id,
      });
      if (!result) return response.success('Data not found', null, res, false);
      const cryptoAssets = await transformer.detail(result);
      return response.success('Data crypto assets', cryptoAssets, res);
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

      return response.success('Data success saved', null, res);
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
      const id: string = req.params.id || '';
      if (!helper.isValidUUID(id))
        return response.failed(`id ${id} is not valid`, 400, res);

      const check = await repository.detail({ crypto_assets_id: id });
      if (!check) return response.success('Data not found', null, res, false);

      const data: Object = helper.only(variable.fillable(), req?.body, true);
      await repository.update({
        payload: {
          ...data,
          modified_by: req?.user?.id,
        },
        condition: { crypto_assets_id: id },
      });
      return response.success('Data success updated', null, res);
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
      const id: string = req.params.id || '';
      if (!helper.isValidUUID(id))
        return response.failed(`id ${id} is not valid`, 400, res);

      const date: string = helper.date();
      const check = await repository.detail({ crypto_assets_id: id });
      if (!check) return response.success('Data not found', null, res, false);
      await repository.update({
        payload: {
          status: 9,
          modified_by: req?.user?.id,
          modified_date: date,
        },
        condition: { crypto_assets_id: id },
      });
      return response.success('Data success deleted', null, res);
    } catch (err: any) {
      return helper.catchError(
        `crypto assets delete: ${err?.message}`,
        500,
        res
      );
    }
  }
}

export const cryptoassets = new Controller();
