'use strict';

import dotenv from 'dotenv';
import moment from 'moment';
import { Request, Response } from 'express';
import { helper } from '../../helpers/helper';
import { Op, fn, col, Sequelize } from 'sequelize';
import { response } from '../../helpers/response';
import { transformer } from './global.transformer';
import { repository as RepoMenu } from '../app/menu/menu.repository';
import { repository as repoPolicy } from '../insurance/policy/policy.repository';
import { transformer as transformerPolicy } from '../insurance/policy/policy.transformer';

dotenv.config();

const nestedChildren = (
  data: any,
  parent: string = '00000000-0000-0000-0000-000000000000'
) => {
  let result: Array<object> = [];
  data.forEach((item: any) => {
    const menu: any = item?.dataValues;
    if (menu?.parent_id === parent) {
      let children: any = nestedChildren(data, menu?.menu_id);
      result.push({
        ...menu,
        children,
      });
    }
  });
  return result;
};

export default class Controller {
  public index(req: Request, res: Response) {
    return response.success('Hello from the POC RESTful API  !!!!!', null, res);
  }

  public async navigation(req: Request, res: Response) {
    try {
      const result = await RepoMenu.list();
      if (result?.length < 1)
        return response.failed('Data not found', 404, res);
      const navigation = nestedChildren(result);
      return response.success('Data navigation', navigation, res);
    } catch (err: any) {
      return helper.catchError(`navigation: ${err?.message}`, 500, res);
    }
  }

  public sendmail = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, subject, content } = req?.body;
      if (!email) return response.failed('email is required', 422, res);
      if (!subject) return response.failed('subject is required', 422, res);
      if (!content) return response.failed('content is required', 422, res);

      let attachments: Array<Object> = [];
      if (req?.files && req?.files?.attachs) {
        const attachs = req?.files?.attachs;
        if (attachs?.length > 0) {
          for (let i in attachs) {
            attachments.push({
              filename: attachs[i]?.name,
              path: attachs[i]?.tempFilePath,
            });
          }
        } else {
          attachments.push({
            filename: attachs?.name,
            path: attachs?.tempFilePath,
          });
        }
      }

      await helper.sendEmail({
        to: email,
        subject: subject,
        content: content,
        attachments: attachments,
      });

      return response.success('Send email success', null, res);
    } catch (err: any) {
      return helper.catchError(`sendmail: ${err?.message}`, 500, res);
    }
  };

  public async summary(req: Request, res: Response) {
    try {
      const client: any = req?.query?.client;
      const role: string = req?.user?.role_name;

      let condition: any = {};
      if (['administrator', 'agent'].includes(role)) {
        if (client && client != undefined) {
          condition = {
            [Op.or]: [{ policy_holder: client }, { insured_holder: client }],
          };
        }
      } else {
        condition = {
          [Op.or]: [
            { policy_holder: req?.user?.client_id },
            { insured_holder: req?.user?.client_id },
          ],
        };
      }

      const jatuhTempo = await repoPolicy.list({
        ...condition,
        policy_id: {
          [Op.in]: Sequelize.literal(`(
            SELECT pc.policy_id
            FROM insurance_policy pc
            WHERE pc.premi_off = 'N' AND pc.payment_term_unit LIKE '%tahun%'
            AND NOW() <= DATE_ADD(pc.issued_date, INTERVAL pc.payment_term YEAR)
          )`),
        },
      });

      const benefit = await repoPolicy.list(condition);
      const result = await transformer.summary(jatuhTempo, benefit);
      return response.success('Data summary', result, res);
    } catch (err: any) {
      return helper.catchError(`summary: ${err?.message}`, 500, res);
    }
  }

  public async dashboard(req: Request, res: Response) {
    try {
      const client: any = req?.query?.client;
      const role: string = req?.user?.role_name;
      const limit: any = req?.query?.perPage || 10;
      const offset: any = req?.query?.page || 1;
      const keyword: any = req?.query?.q;
      const flag: any = req?.query?.flag;

      let condition: any = {};
      if (['administrator', 'agent'].includes(role)) {
        if (client && client != undefined) {
          condition = {
            [Op.or]: [{ policy_holder: client }, { insured_holder: client }],
          };
        }
      } else {
        condition = {
          [Op.or]: [
            { policy_holder: req?.user?.client_id },
            { insured_holder: req?.user?.client_id },
          ],
        };
      }

      if (flag && flag == 'total_premi') {
        condition = {
          ...condition,
          policy_id: {
            [Op.in]: Sequelize.literal(`(
              SELECT pc.policy_id
              FROM insurance_policy pc
              WHERE pc.premi_off = 'N' AND pc.payment_term_unit LIKE '%tahun%'
              AND NOW() <= DATE_ADD(pc.issued_date, INTERVAL pc.payment_term YEAR)
            )`),
          },
        };
      }

      let benefit: string = '';
      if (
        flag &&
        ['up_jiwa', 'rs', 'penyakit_kritis', 'pensiun', 'dijamin'].includes(
          flag
        )
      ) {
        benefit = flag;
      }

      const { count, rows } = await repoPolicy.index(
        {
          limit: parseInt(limit),
          offset: parseInt(limit) * (parseInt(offset) - 1),
          keyword: keyword,
          condition: condition,
        },
        true,
        benefit
      );
      if (rows?.length < 1) return response.failed('Data not found', 404, res);
      const policy = await transformerPolicy.list(rows);
      return response.success(
        'Data dashboard',
        {
          total: count,
          values: policy,
        },
        res
      );
    } catch (err: any) {
      return helper.catchError(`dashboard: ${err?.message}`, 500, res);
    }
  }

  public async updateCurrency(req: Request, res: Response) {
    try {
      const currency: string = req.params.currency || '';
      if (!currency) return response.failed('currency is required', 422, res);
      const result = await helper.fetchLatestCurrency(currency);
      return response.success(result, null, res);
    } catch (err: any) {
      return helper.catchError(`update currency: ${err?.message}`, 500, res);
    }
  }
}

export const global = new Controller();
