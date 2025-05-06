'use strict';

import { Op } from 'sequelize';
import { Request, Response } from 'express';
import { helper } from '../../helpers/helper';
import { repository } from './currency.repository';
import { response } from '../../helpers/response';

export default class Controller {
  public async detail(req: Request, res: Response) {
    try {
      const key: string = req.params.key || '';

      const result: Object | any = await repository.detail({ key });
      if (!result) return response.success('Data not found', null, res, false);
      return response.success('Data currency', result, res);
    } catch (err: any) {
      return helper.catchError(`currency detail: ${err?.message}`, 500, res);
    }
  }
}

export const currency = new Controller();
