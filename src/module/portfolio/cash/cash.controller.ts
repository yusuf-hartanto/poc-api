'use strict';

import { variable } from './cash.variable';
import { Request, Response } from 'express';
import { repository } from './cash.repository';
import { transformer } from './cash.transformer';
import { helper } from '../../../helpers/helper';
import { response } from '../../../helpers/response';
import {
  INVALID,
  NOT_FOUND,
  ROLE_ADMIN,
  ROLE_AGENT,
  SUCCESS_DELETED,
  SUCCESS_RETRIEVED,
  SUCCESS_SAVED,
  SUCCESS_UPDATED,
} from '../../../utils/constant';

export default class Controller {
  public async list(req: Request, res: Response) {
    try {
      const clientId: any = req?.query?.client;

      let condition: any = {};
      if (clientId != undefined) condition = { cash_holder: clientId };
      else if (![ROLE_ADMIN, ROLE_AGENT].includes(req?.user?.role_name))
        condition = { cash_holder: req?.user?.client_id };

      const result = await repository.list(condition);
      if (result?.length < 1)
        return response.success(NOT_FOUND, null, res, false);
      const cash = await transformer.list(result);
      return response.success(SUCCESS_RETRIEVED, cash, res);
    } catch (err: any) {
      return helper.catchError(`cash all-data: ${err?.message}`, 500, res);
    }
  }

  public async index(req: Request, res: Response) {
    try {
      const limit: any = req?.query?.perPage || 10;
      const offset: any = req?.query?.page || 1;
      const keyword: any = req?.query?.q;
      const clientId: any = req?.query?.client;

      let condition: any = {};
      if (clientId != undefined) condition = { cash_holder: clientId };
      else if (![ROLE_ADMIN, ROLE_AGENT].includes(req?.user?.role_name))
        condition = { cash_holder: req?.user?.client_id };

      const { count, rows } = await repository.index({
        limit: parseInt(limit),
        offset: parseInt(limit) * (parseInt(offset) - 1),
        keyword: keyword,
        condition: condition,
      });
      if (rows?.length < 1)
        return response.success(NOT_FOUND, null, res, false);
      const cash = await transformer.list(rows);
      return response.success(
        SUCCESS_RETRIEVED,
        { total: count, values: cash },
        res
      );
    } catch (err: any) {
      return helper.catchError(`cash index: ${err?.message}`, 500, res);
    }
  }

  public async detail(req: Request, res: Response) {
    try {
      const id: string = req.params.id || '';
      if (!helper.isValidUUID(id))
        return response.failed(`id ${id} ${INVALID}`, 400, res);

      const result: Object | any = await repository.detail({
        cash_id: id,
      });
      if (!result) return response.success(NOT_FOUND, null, res, false);
      const cash = await transformer.detail(result);
      return response.success(SUCCESS_RETRIEVED, cash, res);
    } catch (err: any) {
      return helper.catchError(`cash detail: ${err?.message}`, 500, res);
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
      return helper.catchError(`cash create: ${err?.message}`, 500, res);
    }
  }

  public async update(req: Request, res: Response) {
    try {
      const id: string = req.params.id || '';
      if (!helper.isValidUUID(id))
        return response.failed(`id ${id} ${INVALID}`, 400, res);

      const check = await repository.detail({ cash_id: id });
      if (!check) return response.success(NOT_FOUND, null, res, false);

      const data: Object = helper.only(variable.fillable(), req?.body, true);
      await repository.update({
        payload: {
          ...data,
          modified_by: req?.user?.id,
        },
        condition: { cash_id: id },
      });
      return response.success(SUCCESS_UPDATED, null, res);
    } catch (err: any) {
      return helper.catchError(`cash update: ${err?.message}`, 500, res);
    }
  }

  public async delete(req: Request, res: Response) {
    try {
      const id: string = req.params.id || '';
      if (!helper.isValidUUID(id))
        return response.failed(`id ${id} ${INVALID}`, 400, res);

      const date: string = helper.date();
      const check = await repository.detail({ cash_id: id });
      if (!check) return response.success(NOT_FOUND, null, res, false);
      await repository.update({
        payload: {
          status: 9,
          modified_by: req?.user?.id,
          modified_date: date,
        },
        condition: { cash_id: id },
      });
      return response.success(SUCCESS_DELETED, null, res);
    } catch (err: any) {
      return helper.catchError(`cash delete: ${err?.message}`, 500, res);
    }
  }
}

export const cash = new Controller();
