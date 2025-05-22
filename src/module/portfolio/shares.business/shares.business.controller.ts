'use strict';

import { Request, Response } from 'express';
import { helper } from '../../../helpers/helper';
import { response } from '../../../helpers/response';
import { variable } from './shares.business.variable';
import { appConfig } from '../../../config/config.app';
import { repository } from './shares.business.repository';
import { transformer } from './shares.business.transformer';
import {
  NOT_FOUND,
  ROLE_ADMIN,
  ROLE_AGENT,
  SUCCESS_DELETED,
  SUCCESS_RETRIEVED,
  SUCCESS_SAVED,
  SUCCESS_UPDATED,
} from '../../../utils/constant';

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
            'shares_business',
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
          'shares_business',
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
      const { role_name, client_id } = req?.user;
      const clientId: any = req?.query?.client;

      let condition: any = {};
      if (clientId != undefined)
        condition = { shares_business_holder: clientId };
      else if (![ROLE_ADMIN, ROLE_AGENT].includes(role_name))
        condition = { shares_business_holder: client_id };

      const result = await repository.list(condition);
      if (result?.length < 1)
        return response.success(NOT_FOUND, null, res, false);
      const sharesBusiness = await transformer.list(result);
      return response.success(SUCCESS_RETRIEVED, sharesBusiness, res);
    } catch (err: any) {
      return helper.catchError(
        `shares business all-data: ${err?.message}`,
        500,
        res
      );
    }
  }

  public async index(req: Request, res: Response) {
    try {
      const { role_name, client_id } = req?.user;
      const clientId: any = req?.query?.client;
      const query = helper.fetchQueryIndex(req);

      let condition: any = {};
      if (clientId != undefined)
        condition = { shares_business_holder: clientId };
      else if (![ROLE_ADMIN, ROLE_AGENT].includes(role_name))
        condition = { shares_business_holder: client_id };

      const { count, rows } = await repository.index({
        ...query,
        condition: condition,
        role_name: role_name,
      });
      if (rows?.length < 1)
        return response.success(NOT_FOUND, null, res, false);
      const sharesBusiness = await transformer.list(rows);
      return response.success(
        SUCCESS_RETRIEVED,
        { total: count, values: sharesBusiness },
        res
      );
    } catch (err: any) {
      return helper.catchError(
        `shares business index: ${err?.message}`,
        500,
        res
      );
    }
  }

  public async detail(req: Request, res: Response) {
    try {
      const id: string = req?.params?.id || '';
      const result: Object | any = await repository.detail({
        shares_business_id: id,
      });
      if (!result) return response.success(NOT_FOUND, null, res, false);
      const sharesBusiness = await transformer.detail(result);
      return response.success(SUCCESS_RETRIEVED, sharesBusiness, res);
    } catch (err: any) {
      return helper.catchError(
        `shares business detail: ${err?.message}`,
        500,
        res
      );
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

      return response.success(SUCCESS_SAVED, null, res);
    } catch (err: any) {
      return helper.catchError(
        `shares business create: ${err?.message}`,
        500,
        res
      );
    }
  }

  public async update(req: Request, res: Response) {
    try {
      const id: string = req?.params?.id || '';
      const check = await repository.detail({ shares_business_id: id });
      if (!check) return response.success(NOT_FOUND, null, res, false);

      const docLocation: any = await uploadImages(req);
      const data: Object = helper.only(variable.fillable(), req?.body, true);
      await repository.update({
        payload: {
          ...data,
          doc_location: docLocation || check?.getDataValue('doc_location'),
          modified_by: req?.user?.id,
        },
        condition: { shares_business_id: id },
      });
      return response.success(SUCCESS_UPDATED, null, res);
    } catch (err: any) {
      return helper.catchError(
        `shares business update: ${err?.message}`,
        500,
        res
      );
    }
  }

  public async delete(req: Request, res: Response) {
    try {
      const id: string = req?.params?.id || '';
      const date: string = helper.date();
      const check = await repository.detail({ shares_business_id: id });
      if (!check) return response.success(NOT_FOUND, null, res, false);
      await repository.update({
        payload: {
          status: 9,
          modified_by: req?.user?.id,
          modified_date: date,
        },
        condition: { shares_business_id: id },
      });
      return response.success(SUCCESS_DELETED, null, res);
    } catch (err: any) {
      return helper.catchError(
        `shares business delete: ${err?.message}`,
        500,
        res
      );
    }
  }
}

export const sharesbusiness = new Controller();
