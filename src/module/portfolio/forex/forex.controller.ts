'use strict';

import { variable } from './forex.variable';
import { Request, Response } from 'express';
import { repository } from './forex.repository';
import { helper } from '../../../helpers/helper';
import { transformer } from './forex.transformer';
import { response } from '../../../helpers/response';

export default class Controller {
  public async list(req: Request, res: Response) {
    try {
      const clientId: any = req?.query?.client_id;

      let condition: any = {};
      if (clientId != undefined) condition = { forex_holder: clientId };
      else if (!['administrator', 'agent'].includes(req?.user?.role_name))
        condition = { forex_holder: req?.user?.client_id };

      const result = await repository.list(condition);
      if (result?.length < 1)
        return response.failed('Data not found', 404, res);
      const forex = await transformer.list(result);
      return response.success('list data forex', forex, res);
    } catch (err: any) {
      return helper.catchError(`forex all-data: ${err?.message}`, 500, res);
    }
  }

  public async index(req: Request, res: Response) {
    try {
      const limit: any = req?.query?.perPage || 10;
      const offset: any = req?.query?.page || 1;
      const keyword: any = req?.query?.q;
      const clientId: any = req?.query?.client_id;

      let condition: any = {};
      if (clientId != undefined) condition = { forex_holder: clientId };
      else if (!['administrator', 'agent'].includes(req?.user?.role_name))
        condition = { forex_holder: req?.user?.client_id };

      const { count, rows } = await repository.index({
        limit: parseInt(limit),
        offset: parseInt(limit) * (parseInt(offset) - 1),
        keyword: keyword,
        condition: condition,
      });
      if (rows?.length < 1) return response.failed('Data not found', 404, res);
      const forex = await transformer.list(rows);
      return response.success(
        'Data forex',
        { total: count, values: forex },
        res
      );
    } catch (err: any) {
      return helper.catchError(`forex index: ${err?.message}`, 500, res);
    }
  }

  public async detail(req: Request, res: Response) {
    try {
      const id: string = req.params.id || '';
      if (!helper.isValidUUID(id))
        return response.failed(`id ${id} is not valid`, 400, res);

      const result: Object | any = await repository.detail({
        forex_id: id,
      });
      if (!result) return response.failed('Data not found', 404, res);
      const forex = await transformer.detail(result);
      return response.success('Data forex', forex, res);
    } catch (err: any) {
      return helper.catchError(`forex detail: ${err?.message}`, 500, res);
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
      return helper.catchError(`forex create: ${err?.message}`, 500, res);
    }
  }

  public async update(req: Request, res: Response) {
    try {
      const id: string = req.params.id || '';
      if (!helper.isValidUUID(id))
        return response.failed(`id ${id} is not valid`, 400, res);

      const check = await repository.detail({ forex_id: id });
      if (!check) return response.failed('Data not found', 404, res);

      const data: Object = helper.only(variable.fillable(), req?.body, true);
      await repository.update({
        payload: {
          ...data,
          modified_by: req?.user?.id,
        },
        condition: { forex_id: id },
      });
      return response.success('Data success updated', null, res);
    } catch (err: any) {
      return helper.catchError(`forex update: ${err?.message}`, 500, res);
    }
  }

  public async delete(req: Request, res: Response) {
    try {
      const id: string = req.params.id || '';
      if (!helper.isValidUUID(id))
        return response.failed(`id ${id} is not valid`, 400, res);

      const date: string = helper.date();
      const check = await repository.detail({ forex_id: id });
      if (!check) return response.failed('Data not found', 404, res);
      await repository.update({
        payload: {
          status: 9,
          modified_by: req?.user?.id,
          modified_date: date,
        },
        condition: { forex_id: id },
      });
      return response.success('Data success deleted', null, res);
    } catch (err: any) {
      return helper.catchError(`forex delete: ${err?.message}`, 500, res);
    }
  }
}

export const forex = new Controller();
