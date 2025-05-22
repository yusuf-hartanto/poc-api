'use strict';

import { Op } from 'sequelize';
import { Request, Response } from 'express';
import { helper } from '../../helpers/helper';
import { repository } from './currency.repository';
import { response } from '../../helpers/response';
import { NOT_FOUND, SUCCESS_RETRIEVED } from '../../utils/constant';

export default class Controller {
  public async detail(req: Request, res: Response) {
    try {
      const key: string = req?.params?.key || '';
      const result: Object | any = await repository.detail({ key });
      if (!result) return response.success(NOT_FOUND, null, res, false);
      return response.success(SUCCESS_RETRIEVED, result, res);
    } catch (err: any) {
      return helper.catchError(`currency detail: ${err?.message}`, 500, res);
    }
  }
}

export const currency = new Controller();
