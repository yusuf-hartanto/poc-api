'use strict';

import { Request, Response } from 'express';
import { helper } from '../../../helpers/helper';
import { response } from '../../../helpers/response';
import { variable } from './safe.deposit.box.variable';
import { repository } from './safe.deposit.box.repository';

export default class Controller {
  public async list(req: Request, res: Response) {
    try {
      const result = await repository.list({});
      if (result?.length < 1)
        return response.success('Data not found', null, res, false);
      return response.success('list data safe deposit box', result, res);
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
      const limit: any = req?.query?.perPage || 10;
      const offset: any = req?.query?.page || 1;
      const keyword: any = req?.query?.q;

      const { count, rows } = await repository.index({
        limit: parseInt(limit),
        offset: parseInt(limit) * (parseInt(offset) - 1),
        keyword: keyword,
      });
      if (rows?.length < 1)
        return response.success('Data not found', null, res, false);
      return response.success(
        'Data safe deposit box',
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
      const id: string = req.params.id || '';
      if (!helper.isValidUUID(id))
        return response.failed(`id ${id} is not valid`, 400, res);

      const result: Object | any = await repository.detail({
        sdb_id: id,
      });
      if (!result) return response.success('Data not found', null, res, false);
      return response.success('Data safe deposit box', result, res);
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

      return response.success('Data success saved', null, res);
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
      const id: string = req.params.id || '';
      if (!helper.isValidUUID(id))
        return response.failed(`id ${id} is not valid`, 400, res);

      const check = await repository.detail({ sdb_id: id });
      if (!check) return response.success('Data not found', null, res, false);

      const data: Object = helper.only(variable.fillable(), req?.body, true);
      await repository.update({
        payload: {
          ...data,
          modified_by: req?.user?.id,
        },
        condition: { sdb_id: id },
      });
      return response.success('Data success updated', null, res);
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
      const id: string = req.params.id || '';
      if (!helper.isValidUUID(id))
        return response.failed(`id ${id} is not valid`, 400, res);

      const date: string = helper.date();
      const check = await repository.detail({ sdb_id: id });
      if (!check) return response.success('Data not found', null, res, false);
      await repository.update({
        payload: {
          status: 9,
          modified_by: req?.user?.id,
          modified_date: date,
        },
        condition: { sdb_id: id },
      });
      return response.success('Data success deleted', null, res);
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
