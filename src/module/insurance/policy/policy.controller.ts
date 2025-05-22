'use strict';

import { Op } from 'sequelize';
import { Request, Response } from 'express';
import { variable } from './policy.variable';
import { helper } from '../../../helpers/helper';
import { repository } from './policy.repository';
import { transformer } from './policy.transformer';
import { response } from '../../../helpers/response';
import {
  NOT_FOUND,
  ROLE_ADMIN,
  ROLE_AGENT,
  SUCCESS_DELETED,
  SUCCESS_RETRIEVED,
  SUCCESS_SAVED,
  SUCCESS_UPDATED,
} from '../../../utils/constant';

export default class Controller {
  public async index(req: Request, res: Response) {
    try {
      const query = helper.fetchQueryIndex(req);

      let condition: any = {};
      if (![ROLE_ADMIN, ROLE_AGENT].includes(req?.user?.role_name))
        condition = {
          [Op.or]: [
            { policy_holder: req?.user?.client_id },
            { insured_holder: req?.user?.client_id },
          ],
        };

      const { count, rows } = await repository.index({
        ...query,
        condition: condition,
      });
      if (rows?.length < 1)
        return response.success(NOT_FOUND, null, res, false);
      const policy = await transformer.list(rows);
      return response.success(
        SUCCESS_RETRIEVED,
        {
          total: count,
          values: policy,
        },
        res
      );
    } catch (err: any) {
      return helper.catchError(`policy index: ${err?.message}`, 500, res);
    }
  }

  public async detail(req: Request, res: Response) {
    try {
      const id: string = req?.params?.id || '';
      const result: Object | any = await repository.detail({ policy_id: id });
      if (!result) return response.success(NOT_FOUND, null, res, false);
      const policy = await transformer.detail(result);
      return response.success(SUCCESS_RETRIEVED, policy, res);
    } catch (err: any) {
      return helper.catchError(`policy detail: ${err?.message}`, 500, res);
    }
  }

  public async create(req: Request, res: Response) {
    try {
      const data: Object = helper.only(variable.policy(), req?.body);
      const policy = await repository.create({
        payload: {
          ...data,
          created_by: req?.user?.id,
        },
      });
      const { detail } = req?.body;
      if (detail?.length > 0) {
        for (let i in detail) {
          const dataDetail: Object = helper.only(variable.detail(), detail[i]);
          await repository.createDetail({
            payload: {
              ...dataDetail,
              unit_link: req?.body?.unit_link || 0,
              fund: req?.body?.fund || null,
              policy_id: policy?.dataValues?.policy_id,
              created_by: req?.user?.id,
            },
          });
        }
      }
      return response.success(SUCCESS_SAVED, null, res);
    } catch (err: any) {
      return helper.catchError(`policy create: ${err?.message}`, 500, res);
    }
  }

  public async update(req: Request, res: Response) {
    try {
      const id: string = req?.params?.id || '';
      const check = await repository.detail({ policy_id: id });
      if (!check) return response.success(NOT_FOUND, null, res, false);

      const data: Object = helper.only(variable.policy(), req?.body, true);
      await repository.update({
        payload: {
          ...data,
          modified_by: req?.user?.id,
        },
        condition: { policy_id: id },
      });
      const { detail } = req?.body;
      if (detail?.length > 0) {
        await repository.deleteDetail({
          condition: { policy_id: id },
        });
        for (let i in detail) {
          const dataDetail: Object = helper.only(
            variable.detail(),
            detail[i],
            true
          );
          await repository.createDetail({
            payload: {
              ...dataDetail,
              policy_id: id,
              unit_link: req?.body?.unit_link || 0,
              fund: req?.body?.fund || null,
              created_by: req?.user?.id,
              modified_by: req?.user?.id,
            },
          });
        }
      }
      return response.success(SUCCESS_UPDATED, null, res);
    } catch (err: any) {
      return helper.catchError(`policy update: ${err?.message}`, 500, res);
    }
  }

  public async delete(req: Request, res: Response) {
    try {
      const id: string = req?.params?.id || '';
      const date: string = helper.date();
      const check = await repository.detail({ policy_id: id });
      if (!check) return response.success(NOT_FOUND, null, res, false);
      await repository.update({
        payload: {
          status: 9,
          modified_by: req?.user?.id,
          modified_date: date,
        },
        condition: { policy_id: id },
      });
      return response.success(SUCCESS_DELETED, null, res);
    } catch (err: any) {
      return helper.catchError(`policy delete: ${err?.message}`, 500, res);
    }
  }
}

export const policy = new Controller();
