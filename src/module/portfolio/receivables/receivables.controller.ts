'use strict';

import { Request, Response } from 'express';
import { helper } from '../../../helpers/helper';
import { variable } from './receivablesvariable';
import { response } from '../../../helpers/response';
import { repository } from './receivables.repository';
import { appConfig } from '../../../config/config.app';
import { transformer } from './receivables.transformer';

const uploadImages = async (req: Request) => {
  if (req?.files && req?.files?.images) {
    const images = req?.files?.images;
    let dataFiles: Array<String> = [];
    if (images?.length > 0) {
      for (let i in images) {
        let checkFile = helper.checkExtention(images[i]);
        if (checkFile == 'allowed') {
          const path_image = await helper.upload(
            images[i],
            'receivables',
            req?.user?.username,
            appConfig?.assetType
          );
          dataFiles.push(path_image);
        }
      }
    } else {
      let checkFile = helper.checkExtention(images);
      if (checkFile == 'allowed') {
        const path_image = await helper.upload(
          images,
          'receivables',
          req?.user?.username,
          appConfig?.assetType
        );
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
      const clientId: any = req?.query?.client;

      let condition: any = {};
      if (clientId != undefined) condition = { receivables_holder: clientId };
      else if (!['administrator', 'agent'].includes(req?.user?.role_name))
        condition = { receivables_holder: req?.user?.client_id };

      const result = await repository.list(condition);
      if (result?.length < 1)
        return response.success('Data not found', null, res, false);
      const receivables = await transformer.list(result);
      return response.success('list data receivables', receivables, res);
    } catch (err: any) {
      return helper.catchError(
        `receivables all-data: ${err?.message}`,
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
      const clientId: any = req?.query?.client;

      let condition: any = {};
      if (clientId != undefined) condition = { receivables_holder: clientId };
      else if (!['administrator', 'agent'].includes(req?.user?.role_name))
        condition = { receivables_holder: req?.user?.client_id };

      const { count, rows } = await repository.index({
        limit: parseInt(limit),
        offset: parseInt(limit) * (parseInt(offset) - 1),
        keyword: keyword,
        condition: condition,
      });
      if (rows?.length < 1)
        return response.success('Data not found', null, res, false);
      const receivables = await transformer.list(rows);
      return response.success(
        'Data receivables',
        { total: count, values: receivables },
        res
      );
    } catch (err: any) {
      return helper.catchError(`receivables index: ${err?.message}`, 500, res);
    }
  }

  public async detail(req: Request, res: Response) {
    try {
      const id: string = req.params.id || '';
      if (!helper.isValidUUID(id))
        return response.failed(`id ${id} is not valid`, 400, res);

      const result: Object | any = await repository.detail({
        receivables_id: id,
      });
      if (!result) return response.success('Data not found', null, res, false);
      const receivables = await transformer.detail(result);
      return response.success('Data receivables', receivables, res);
    } catch (err: any) {
      return helper.catchError(`receivables detail: ${err?.message}`, 500, res);
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
      return helper.catchError(`receivables create: ${err?.message}`, 500, res);
    }
  }

  public async update(req: Request, res: Response) {
    try {
      const id: string = req.params.id || '';
      if (!helper.isValidUUID(id))
        return response.failed(`id ${id} is not valid`, 400, res);

      const check = await repository.detail({ receivables_id: id });
      if (!check) return response.success('Data not found', null, res, false);

      const docLocation: any = await uploadImages(req);
      const data: Object = helper.only(variable.fillable(), req?.body, true);
      await repository.update({
        payload: {
          ...data,
          doc_location: docLocation || check?.getDataValue('doc_location'),
          modified_by: req?.user?.id,
        },
        condition: { receivables_id: id },
      });
      return response.success('Data success updated', null, res);
    } catch (err: any) {
      return helper.catchError(`receivables update: ${err?.message}`, 500, res);
    }
  }

  public async delete(req: Request, res: Response) {
    try {
      const id: string = req.params.id || '';
      if (!helper.isValidUUID(id))
        return response.failed(`id ${id} is not valid`, 400, res);

      const date: string = helper.date();
      const check = await repository.detail({ receivables_id: id });
      if (!check) return response.success('Data not found', null, res, false);
      await repository.update({
        payload: {
          status: 9,
          modified_by: req?.user?.id,
          modified_date: date,
        },
        condition: { receivables_id: id },
      });
      return response.success('Data success deleted', null, res);
    } catch (err: any) {
      return helper.catchError(`receivables delete: ${err?.message}`, 500, res);
    }
  }
}

export const receivables = new Controller();
