'use strict';

import { Request, Response } from 'express';
import { helper } from '../../helpers/helper';
import { response } from '../../helpers/response';
import { repository } from './upload.repository';

export default class Controller {
  public async upload(req: Request, res: Response) {
    try {
      let image: any = null;
      let savedImage: any = null;

      const fileInput = req?.files?.image || req?.body?.image;

      if (!fileInput) {
        return response.failed(
          'File image atau base64 string wajib diisi',
          422,
          res
        );
      }

      const checkFile = helper.checkExtention(fileInput);
      if (checkFile !== 'allowed') return response.failed(checkFile, 422, res);

      image = await helper.uploadSmallpict(fileInput, {
        filename:
          req?.body?.filename ||
          fileInput?.name ||
          fileInput?.originalname ||
          fileInput?.filename,
        folder: 'smallpict',
      });

      if (!image || image?.status === 'failed' || !image?.url) {
        const errorMsg =
          image?.error?.message ||
          'Konversi gambar gagal: format gambar tidak didukung oleh SmallPict';
        return response.failed(errorMsg, 422, res);
      }

      savedImage = await repository.create({
        filename: image?.filename,
        url: image?.url || image?.path_doc || image?.cdnUrl,
        size: image?.compressedSize || image?.size || 0,
        size_origin:
          image?.size_origin ||
          image?.originalSize ||
          (typeof fileInput === 'object' ? fileInput?.size : 0),
        mime_type:
          image?.mimeType ||
          image?.format ||
          (typeof fileInput === 'object' ? fileInput?.mimetype : 'image/png'),
      });

      return response.success('upload success', savedImage, res);
    } catch (err: any) {
      return helper.catchError(`upload: ${err?.message}`, 500, res);
    }
  }
}

export const upload = new Controller();
