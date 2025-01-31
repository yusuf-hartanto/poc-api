'use strict';

import { Op } from 'sequelize';
import { Request, Response } from 'express';
import { variable } from './policy.variable';
import { helper } from '../../../helpers/helper';
import { repository } from './policy.repository';
import { transformer } from './policy.transformer';
import { response } from '../../../helpers/response';

export default class Controller {
  public async index(req: Request, res: Response) {
    try {
      const limit: any = req?.query?.perPage || 10;
      const offset: any = req?.query?.page || 1;
      const keyword: any = req?.query?.q;

      let condition: any = {};
      if (!['administrastor', 'agent'].includes(req?.user?.role_name))
        condition = {
          [Op.or]: [
            { policy_holder: req?.user?.client_id },
            { insured_holder: req?.user?.client_id },
          ],
        };

      const { count, rows } = await repository.index({
        limit: parseInt(limit),
        offset: parseInt(limit) * (parseInt(offset) - 1),
        keyword: keyword,
        condition: condition,
      });
      if (rows?.length < 1) return response.failed('Data not found', 404, res);
      const policy = await transformer.list(rows);
      return response.success(
        'Data policy',
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
      const id: string = req.params.id || '';
      if (!helper.isValidUUID(id))
        return response.failed(`id ${id} is not valid`, 400, res);

      const result: Object | any = await repository.detail({ policy_id: id });
      if (!result) return response.failed('Data not found', 404, res);
      const policy = await transformer.detail(result);
      return response.success('Data policy', policy, res);
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
              unit_link: req?.body?.unit_link || null,
              fund: req?.body?.fund || null,
              policy_id: policy?.dataValues?.policy_id,
              created_by: req?.user?.id,
            },
          });
        }
      }
      return response.success('Data success saved', null, res);
    } catch (err: any) {
      return helper.catchError(`policy create: ${err?.message}`, 500, res);
    }
  }

  public async update(req: Request, res: Response) {
    try {
      const id: string = req.params.id || '';
      if (!helper.isValidUUID(id))
        return response.failed(`id ${id} is not valid`, 400, res);

      const check = await repository.detail({ policy_id: id });
      if (!check) return response.failed('Data not found', 404, res);

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
              unit_link: req?.body?.unit_link || null,
              fund: req?.body?.fund || null,
              created_by: req?.user?.id,
              modified_by: req?.user?.id,
            },
          });
        }
      }
      return response.success('Data success updated', null, res);
    } catch (err: any) {
      return helper.catchError(`policy update: ${err?.message}`, 500, res);
    }
  }

  public async delete(req: Request, res: Response) {
    try {
      const id: string = req.params.id || '';
      if (!helper.isValidUUID(id))
        return response.failed(`id ${id} is not valid`, 400, res);

      const date: string = helper.date();
      const check = await repository.detail({ policy_id: id });
      if (!check) return response.failed('Data not found', 404, res);
      await repository.update({
        payload: {
          status: 9,
          modified_by: req?.user?.id,
          modified_date: date,
        },
        condition: { policy_id: id },
      });
      return response.success('Data success deleted', null, res);
    } catch (err: any) {
      return helper.catchError(`policy delete: ${err?.message}`, 500, res);
    }
  }
}
export const policy = new Controller();
