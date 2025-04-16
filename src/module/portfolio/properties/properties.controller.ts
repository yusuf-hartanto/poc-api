'use strict';

import moment from 'moment';
import dotenv from 'dotenv';
import { Op } from 'sequelize';
import { variable } from './properties.variable';
import { Request, Response } from 'express';
import { helper } from '../../../helpers/helper';
import { repository } from './properties.repository';
import { transformer } from './properties.transformer';
import { response } from '../../../helpers/response';
import { repository as repoRole } from '../../app/role/role.repository';
import { repository as repoResource } from '../../app/resource/resource.repository';

dotenv.config();

const uploadImages = async (req: Request) => {
  if (req?.files && req?.files?.images) {
    const images = req?.files?.images;
    let dataFiles: Array<String> = [];
    if (images?.length > 0) {
      for (let i in images) {
        let checkFile = helper.checkExtention(images[i]);
        if (checkFile == 'allowed') {
          const path_image = await helper.upload(images[i], 'properties');
          dataFiles.push(path_image);
        }
      }
    } else {
      let checkFile = helper.checkExtention(images);
      if (checkFile == 'allowed') {
        const path_image = await helper.upload(images, 'properties');
        dataFiles.push(path_image);
      }
    }

    if (dataFiles?.length > 0) return dataFiles.join(',');
    else return null;
  }
};

export default class Controller {
  public async list(req: Request, res: Response) {
    try {
      const clientId: any = req?.query?.client_id;

      let condition: any = {};
      if (clientId != undefined) condition = { properties_holder: clientId };
      else if (!['administrator', 'agent'].includes(req?.user?.role_name))
        condition = { properties_holder: req?.user?.client_id };

      const result = await repository.list(condition);
      if (result?.length < 1)
        return response.failed('Data not found', 404, res);
      const properties = await transformer.list(result);
      return response.success('list data properties', properties, res);
    } catch (err: any) {
      return helper.catchError(
        `properties all-data: ${err?.message}`,
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
      const clientId: any = req?.query?.client_id;

      let condition: any = {};
      if (clientId != undefined) condition = { properties_holder: clientId };
      else if (!['administrator', 'agent'].includes(req?.user?.role_name))
        condition = { properties_holder: req?.user?.client_id };

      const { count, rows } = await repository.index({
        limit: parseInt(limit),
        offset: parseInt(limit) * (parseInt(offset) - 1),
        keyword: keyword,
        condition: condition,
      });
      if (rows?.length < 1) return response.failed('Data not found', 404, res);
      const properties = await transformer.list(rows);
      return response.success(
        'Data properties',
        { total: count, values: properties },
        res
      );
    } catch (err: any) {
      return helper.catchError(`properties index: ${err?.message}`, 500, res);
    }
  }

  public async detail(req: Request, res: Response) {
    try {
      const id: string = req.params.id || '';
      if (!helper.isValidUUID(id))
        return response.failed(`id ${id} is not valid`, 400, res);

      const result: Object | any = await repository.detail({
        properties_id: id,
      });
      if (!result) return response.failed('Data not found', 404, res);
      const properties = await transformer.detail(result);
      return response.success('Data properties', properties, res);
    } catch (err: any) {
      return helper.catchError(`properties detail: ${err?.message}`, 500, res);
    }
  }

  public async create(req: Request, res: Response) {
    try {
      const docLocation: any = await uploadImages(req);
      const data: Object = helper.only(variable.fillable(), req?.body);
      await repository.create({
        payload: {
          ...data,
          doc_location: docLocation,
          created_by: req?.user?.id,
        },
      });

      return response.success('Data success saved', null, res);
    } catch (err: any) {
      return helper.catchError(`properties create: ${err?.message}`, 500, res);
    }
  }

  public async update(req: Request, res: Response) {
    try {
      const id: string = req.params.id || '';
      if (!helper.isValidUUID(id))
        return response.failed(`id ${id} is not valid`, 400, res);

      const check = await repository.detail({ properties_id: id });
      if (!check) return response.failed('Data not found', 404, res);

      const docLocation: any = await uploadImages(req);
      const data: Object = helper.only(variable.fillable(), req?.body, true);
      await repository.update({
        payload: {
          ...data,
          doc_location: docLocation || check?.getDataValue('doc_location'),
          modified_by: req?.user?.id,
        },
        condition: { properties_id: id },
      });
      return response.success('Data success updated', null, res);
    } catch (err: any) {
      return helper.catchError(`properties update: ${err?.message}`, 500, res);
    }
  }

  public async delete(req: Request, res: Response) {
    try {
      const id: string = req.params.id || '';
      if (!helper.isValidUUID(id))
        return response.failed(`id ${id} is not valid`, 400, res);

      const date: string = helper.date();
      const check = await repository.detail({ properties_id: id });
      if (!check) return response.failed('Data not found', 404, res);
      await repository.update({
        payload: {
          status: 9,
          modified_by: req?.user?.id,
          modified_date: date,
        },
        condition: { properties_id: id },
      });
      return response.success('Data success deleted', null, res);
    } catch (err: any) {
      return helper.catchError(`properties delete: ${err?.message}`, 500, res);
    }
  }
}
export const properties = new Controller();
