'use strict';

import { variable } from './client.variable';
import { Request, Response } from 'express';
import { helper } from '../../../helpers/helper';
import { repository } from './client.respository';
import { response } from '../../../helpers/response';

export default class Controller {
  public async list(req: Request, res: Response) {
    try {
      const result = await repository.list();
      if (result?.length < 1)
        return response.failed('Data not found', 404, res);
      return response.success('list data client', result, res);
    } catch (err: any) {
      return helper.catchError(`client all-data: ${err?.message}`, 500, res);
    }
  }

  public async index(req: Request, res: Response) {
    try {
      const limit: any = req?.query?.perPage || 10;
      const offset: any = req?.query?.page || 1;
      const keyword: any = req?.query?.q;
      const { count, rows } = await repository.index({
        limit: parseInt(limit),
        offset: parseInt(limit) * (parseInt(offset) - 1),
        keyword: keyword,
      });
      if (rows?.length < 1) return response.failed('Data not found', 404, res);
      return response.success(
        'Data client',
        { total: count, values: rows },
        res
      );
    } catch (err: any) {
      return helper.catchError(`client index: ${err?.message}`, 500, res);
    }
  }

  public async create(req: Request, res: Response) {
    try {
      const data: Object = helper.only(variable.fillable(), req?.body);
      const { relation_id, relation_name } = req?.body;
      const relationId: string =
        relation_id && relation_id != undefined
          ? relation_id
          : '00000000-0000-0000-0000-000000000000';
      const relationName: string =
        relation_name && relation_name != undefined ? relation_name : null;
      await repository.create({
        payload: {
          ...data,
          relation_id: relationId,
          relation_name: relationName,
          created_by: req?.user?.id,
        },
      });
      return response.success('Data success saved', null, res);
    } catch (err: any) {
      return helper.catchError(`client create: ${err?.message}`, 500, res);
    }
  }

  public async update(req: Request, res: Response) {
    try {
      const id: string = req.params.id || '';
      if (!helper.isValidUUID(id))
        return response.failed(`id ${id} is not valid`, 400, res);

      const check = await repository.detail({ id });
      if (!check) return response.failed('Data not found', 404, res);

      const data: Object = helper.only(variable.fillable(), req?.body, true);
      await repository.update({
        payload: {
          ...data,
          modified_by: req?.user?.id,
        },
        condition: { id },
      });
      return response.success('Data success updated', null, res);
    } catch (err: any) {
      return helper.catchError(`client update: ${err?.message}`, 500, res);
    }
  }

  public async delete(req: Request, res: Response) {
    try {
      const id: string = req.params.id || '';
      if (!helper.isValidUUID(id))
        return response.failed(`id ${id} is not valid`, 400, res);

      const date: string = helper.date();
      const check = await repository.detail({ id });
      if (!check) return response.failed('Data not found', 404, res);
      await repository.update({
        payload: {
          status: 9,
          modified_by: req?.user?.id,
          modified_date: date,
        },
        condition: { id },
      });
      return response.success('Data success deleted', null, res);
    } catch (err: any) {
      return helper.catchError(`client delete: ${err?.message}`, 500, res);
    }
  }
}
export const client = new Controller();
