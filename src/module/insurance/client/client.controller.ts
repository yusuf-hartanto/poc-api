'use strict';

import moment from 'moment';
import { Op } from 'sequelize';
import { variable } from './client.variable';
import { Request, Response } from 'express';
import { helper } from '../../../helpers/helper';
import { repository } from './client.repository';
import { transformer } from './client.transformer';
import { response } from '../../../helpers/response';
import { appConfig } from '../../../config/config.app';
import { repository as repoRole } from '../../app/role/role.repository';
import { repository as repoResource } from '../../app/resource/resource.repository';

const generateCin = async () => {
  let nextCin: string = moment().locale('id').format('YYMMDD');

  const lastCin = await repository.getLastCin();
  if (lastCin) {
    const lastCinNumber =
      parseInt(lastCin?.getDataValue('cin')?.substring(7, 10)) + 1;
    nextCin = `${nextCin}${lastCinNumber.toString().padStart(4, '0')}`;
  } else {
    nextCin = nextCin + '0001';
  }

  return nextCin;
};

export default class Controller {
  public async list(req: Request, res: Response) {
    try {
      let condition: any = {};
      if (!['administrator', 'agent'].includes(req?.user?.role_name))
        condition = {
          [Op.or]: [
            { id: req?.user?.client_id },
            { relation_id: req?.user?.client_id },
          ],
        };

      const result = await repository.list(condition);
      if (result?.length < 1)
        return response.failed('Data not found', 404, res);
      const clients = await transformer.list(result);
      return response.success('list data client', clients, res);
    } catch (err: any) {
      return helper.catchError(`client all-data: ${err?.message}`, 500, res);
    }
  }

  public async index(req: Request, res: Response) {
    try {
      const limit: any = req?.query?.perPage || 10;
      const offset: any = req?.query?.page || 1;
      const keyword: any = req?.query?.q;

      let condition: any = {};
      if (!['administrator', 'agent'].includes(req?.user?.role_name))
        condition = {
          [Op.or]: [
            { id: req?.user?.client_id },
            { relation_id: req?.user?.client_id },
          ],
        };

      const { count, rows } = await repository.index({
        limit: parseInt(limit),
        offset: parseInt(limit) * (parseInt(offset) - 1),
        keyword: keyword,
        condition: condition,
      });
      if (rows?.length < 1) return response.failed('Data not found', 404, res);
      const clients = await transformer.list(rows);
      return response.success(
        'Data client',
        { total: count, values: clients },
        res
      );
    } catch (err: any) {
      return helper.catchError(`client index: ${err?.message}`, 500, res);
    }
  }

  public async relation(req: Request, res: Response) {
    try {
      const limit: any = req?.query?.perPage || 10;
      const offset: any = req?.query?.page || 1;
      const keyword: any = req?.query?.q;
      const option: any = req?.query?.option;
      const relation: any = req?.query?.relation;
      const { count, rows } = await repository.relation({
        limit: parseInt(limit),
        offset: parseInt(limit) * (parseInt(offset) - 1),
        keyword: keyword,
        relation: relation,
      });
      if (rows?.length < 1) return response.failed('Data not found', 404, res);
      const clients = await transformer.relation(rows, { option, relation });
      return response.success(
        'Data client',
        { total: count, values: clients },
        res
      );
    } catch (err: any) {
      return helper.catchError(`client relation: ${err?.message}`, 500, res);
    }
  }

  public async detail(req: Request, res: Response) {
    try {
      const id: string = req.params.id || '';
      if (!helper.isValidUUID(id))
        return response.failed(`id ${id} is not valid`, 400, res);

      const result: Object | any = await repository.detail({ id });
      if (!result) return response.failed('Data not found', 404, res);
      const client = await transformer.detail(result);
      return response.success('Data client', client, res);
    } catch (err: any) {
      return helper.catchError(`client detail: ${err?.message}`, 500, res);
    }
  }

  public async create(req: Request, res: Response) {
    let confirm_hash: string = '';
    let username: string = req?.body?.username;
    let pass: string = req?.body?.password;
    let relationId: string = '';

    try {
      const { relation_id, relation_name, name, dob, age, contact_number } =
        req?.body;
      relationId =
        relation_id && relation_id != undefined
          ? relation_id
          : '00000000-0000-0000-0000-000000000000';
      const relationName: string =
        relation_name && relation_name != undefined ? relation_name : null;

      let cin: string = req?.body?.cin || '';
      if (!cin || cin == '') {
        cin = await generateCin();
      }

      const data: Object = helper.only(variable.fillable(), req?.body);
      const client = await repository.create({
        payload: {
          ...data,
          cin: cin,
          relation_id: relationId,
          relation_name: relationName,
          created_by: req?.user?.id,
        },
      });

      if (username && pass) {
        const checkUsername = await repoResource.check({
          username: username,
        });
        if (checkUsername) username = username + helper.random(100, 999);

        const role = await repoRole.detail({
          role_name: { [Op.like]: '%client%' },
        });

        // create resource
        confirm_hash = await helper.hashIt(username, 6);
        const password: string = await helper.hashIt(pass);
        await repoResource.create({
          payload: {
            client_id: client?.getDataValue('id') || null,
            role_id: role?.getDataValue('role_id') || null,
            username: username,
            email: `${pass}@${appConfig?.baseDomain}`,
            password: password,
            full_name: name || null,
            date_of_birth: dob || null,
            usia: age || 0,
            telepon: contact_number || null,
            status: 'A',
            confirm_hash: confirm_hash,
            created_by: req?.user?.id || null,
          },
        });
      }

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
