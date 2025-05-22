'use strict';

import { Request, Response } from 'express';
import { helper } from '../../../helpers/helper';
import { response } from '../../../helpers/response';
import { variable } from './safe.deposit.box.variable';
import { repository } from './safe.deposit.box.repository';
import {
  NOT_FOUND,
  SUCCESS_RETRIEVED,
  SUCCESS_SAVED,
  SUCCESS_UPDATED,
  SUCCESS_DELETED,
  ROLE_ADMIN,
  ROLE_AGENT,
} from '../../../utils/constant';

export default class Controller {
  public async list(req: Request, res: Response) {
    try {
      const { role_name, client_id } = req?.user;
      const flagSDB: any = req?.query?.flag_sdb;
      const clientId: any = req?.query?.client;

      let condition: any = {};
      if (clientId != undefined) condition = { sdb_holder: clientId };
      else if (![ROLE_ADMIN, ROLE_AGENT].includes(role_name))
        condition = { sdb_holder: client_id };

      if (flagSDB || flagSDB == '0') {
        condition = { ...condition, flag_sdb: flagSDB };
      }

      const result = await repository.list(condition);
      if (result?.length < 1)
        return response.success(NOT_FOUND, null, res, false);
      return response.success(SUCCESS_RETRIEVED, result, res);
    } catch (err: any) {
      return helper.catchError(
        `safe deposit box all-data: ${err?.message}`,
        500,
        res
      );
    }
  }

  public async index(req: Request, res: Response) {
    try {
      const { role_name, client_id } = req?.user;
      const flagSDB: any = req?.query?.flag_sdb;
      const clientId: any = req?.query?.client;
      const query = helper.fetchQueryIndex(req);

      let condition: any = {};
      if (clientId != undefined) condition = { sdb_holder: clientId };
      else if (![ROLE_ADMIN, ROLE_AGENT].includes(role_name))
        condition = { sdb_holder: client_id };

      if (flagSDB || flagSDB == '0') {
        condition = { ...condition, flag_sdb: flagSDB };
      }

      const { count, rows } = await repository.index({
        ...query,
        condition: condition,
        role_name: role_name,
      });
      if (rows?.length < 1)
        return response.success(NOT_FOUND, null, res, false);
      return response.success(
        SUCCESS_RETRIEVED,
        { total: count, values: rows },
        res
      );
    } catch (err: any) {
      return helper.catchError(
        `safe deposit box index: ${err?.message}`,
        500,
        res
      );
    }
  }

  public async detail(req: Request, res: Response) {
    try {
      const id: string = req?.params?.id || '';
      const result: Object | any = await repository.detail({
        sdb_id: id,
      });
      if (!result) return response.success(NOT_FOUND, null, res, false);
      return response.success(SUCCESS_RETRIEVED, result, res);
    } catch (err: any) {
      return helper.catchError(
        `safe deposit box detail: ${err?.message}`,
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
        `safe deposit box create: ${err?.message}`,
        500,
        res
      );
    }
  }

  public async update(req: Request, res: Response) {
    try {
      const id: string = req?.params?.id || '';
      const check = await repository.detail({ sdb_id: id });
      if (!check) return response.success(NOT_FOUND, null, res, false);

      const data: Object = helper.only(variable.fillable(), req?.body, true);
      await repository.update({
        payload: {
          ...data,
          modified_by: req?.user?.id,
        },
        condition: { sdb_id: id },
      });
      return response.success(SUCCESS_UPDATED, null, res);
    } catch (err: any) {
      return helper.catchError(
        `safe deposit box update: ${err?.message}`,
        500,
        res
      );
    }
  }

  public async delete(req: Request, res: Response) {
    try {
      const id: string = req?.params?.id || '';
      const date: string = helper.date();
      const check = await repository.detail({ sdb_id: id });
      if (!check) return response.success(NOT_FOUND, null, res, false);
      await repository.update({
        payload: {
          status: 9,
          modified_by: req?.user?.id,
          modified_date: date,
        },
        condition: { sdb_id: id },
      });
      return response.success(SUCCESS_DELETED, null, res);
    } catch (err: any) {
      return helper.catchError(
        `safe deposit box delete: ${err?.message}`,
        500,
        res
      );
    }
  }
}

export const safedepositbox = new Controller();
