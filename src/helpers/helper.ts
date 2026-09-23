'use strict';

import fs from 'fs';
import path from 'path';
import axios from 'axios';
import sharp from 'sharp';
import moment from 'moment';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import TelegramBot from 'tele-sender';
import { QueryTypes } from 'sequelize';
import SmallPict from '@smallpict/sdk';
import { Request, Response } from 'express';
import { response } from '../helpers/response';
import { s3Service } from '../utils/s3.service';
import { awsConfig } from '../config/config.aws';
import { appConfig } from '../config/config.app';
import { mailConfig } from '../config/config.mail';
import { teleConfig } from '../config/config.telegram';
import Client from '../module/insurance/client/client.model';
import { APP_NAME, MYSQL, POSTGRES } from '../utils/constant';
import AppResource from '../module/app/resource/resource.model';
import { validate as uuidValidate, version as uuidVersion } from 'uuid';
import { repository as repoCurr } from '../module/currency/currency.repository';

const month: string = moment().format('YYYY-MM');

export default class Helper {
  public date() {
    return moment().locale('id').format('YYYY-MM-DD HH:mm:ss');
  }

  public dateForNumber() {
    return moment().locale('id').format('DDMMYYYY');
  }

  public dateAdd(num: number, type: any) {
    return moment().add(num, type).locale('id').format('YYYY-MM-DD HH:mm:ss');
  }

  public dateSubtract(num: number, type: any) {
    return moment()
      .subtract(num, type)
      .locale('id')
      .format('YYYY-MM-DD HH:mm:ss');
  }

  public dateDiff(date: any, type: any) {
    return moment(date).diff(moment(), type);
  }

  public only(keys: Array<string>, data: any, isUpdate: boolean = false) {
    const date = this.date();
    let result: any = {};

    keys.forEach((i) => {
      if (data.hasOwnProperty(i)) {
        if (
          (data[i] &&
            data[i] !== undefined &&
            data[i] !== '' &&
            data[i] != 'null') ||
          data[i] === 0
        ) {
          result[i] = data[i]
            .toString()
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/&amp;/g, '&');
        } else if (isUpdate) result[i] = data[i] || null;
      }
    });
    if (isUpdate) {
      result = {
        ...result,
        modified_date: date,
      };
    } else {
      result = {
        ...result,
        created_date: date,
      };
    }
    return result;
  }

  public async hashIt(password: string, length: number = 10) {
    const salt: string = await bcrypt.genSalt(length);
    const hashed: string = await bcrypt.hash(password, salt);
    return hashed;
  }

  public async compareIt(password: any, hashed: any) {
    return await bcrypt.compare(password, hashed);
  }

  public random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  public checkExtention(file: any, type: string = 'image') {
    const allowedExt: any = {
      image: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif', 'bmp'],
      video: ['mp4', 'webm', 'avi', 'mkv', 'mov', 'flv', 'mts', 'wmv'],
      file: ['pdf', 'txt', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'],
    };

    if (typeof file === 'string') {
      // 1. Format Data URI: data:image/png;base64,...
      if (file.startsWith('data:')) {
        const match = file.match(/^data:([A-Za-z-+\/]+);base64,/);
        if (match) {
          const mime = match[1];
          const ext = mime.split('/')[1]?.toLowerCase();
          const base64Data = file.replace(/^data:([A-Za-z-+\/]+);base64,/, '');
          const sizeInBytes = (base64Data.length * 3) / 4;
          if (type === 'image' && sizeInBytes > 10485760) {
            return 'file size maksimal *10MB.';
          }
          if (ext && allowedExt[type]?.includes(ext)) return 'allowed';
        }
      }

      // 2. Format Raw Base64 string (e.g. iVBORw0KGgo...)
      const cleaned = file.trim().replace(/\s/g, '');
      const isBase64 = /^[A-Za-z0-9+/=]+$/.test(cleaned);
      if (isBase64) {
        const sizeInBytes = (cleaned.length * 3) / 4;
        if (type === 'image' && sizeInBytes > 10485760) {
          return 'file size maksimal *10MB.';
        }

        try {
          const headerBuf = Buffer.from(cleaned.slice(0, 48), 'base64');
          if (
            headerBuf[0] === 0x89 &&
            headerBuf[1] === 0x50 &&
            headerBuf[2] === 0x4e &&
            headerBuf[3] === 0x47
          ) {
            return 'allowed'; // PNG
          }
          if (
            headerBuf[0] === 0xff &&
            headerBuf[1] === 0xd8 &&
            headerBuf[2] === 0xff
          ) {
            return 'allowed'; // JPEG
          }
          if (
            headerBuf[0] === 0x47 &&
            headerBuf[1] === 0x49 &&
            headerBuf[2] === 0x46
          ) {
            return 'allowed'; // GIF
          }
          if (
            headerBuf.length >= 12 &&
            headerBuf.toString('ascii', 0, 4) === 'RIFF' &&
            headerBuf.toString('ascii', 8, 12) === 'WEBP'
          ) {
            return 'allowed'; // WEBP
          }
          if (headerBuf[0] === 0x42 && headerBuf[1] === 0x4d) {
            return 'allowed'; // BMP
          }
        } catch (_) {}
      }
    }

    if (type == 'image' && file?.size > 10485760)
      return 'file size maksimal *10MB.';
    let ext: string = file?.name?.split('.').pop() || '-';
    if (allowedExt[type]?.includes(ext.toLocaleLowerCase())) return 'allowed';
    return `file extension allowed *${allowedExt[type]?.join(', ')}.`;
  }

  public async upload(
    file: any,
    folder: string = '',
    username: string = 'system',
    type: string = 'local'
  ) {
    const filename: string = file?.name.replace(/ /g, '');
    if (type == 'S3') {
      let uploadResult: string = '';
      try {
        const fileBuffer = fs.readFileSync(path.resolve(file?.tempFilePath));

        await s3Service.uploadFileS3({
          bucketName: awsConfig?.bucket,
          key: `${folder}/${month}/${filename}`,
          body: fileBuffer,
          contentType: file?.mimetype,
          metadata: {
            uploadedBy: username,
            description: `File ${folder}`,
          },
        });
        uploadResult = `https://${awsConfig?.bucket}/${folder}/${month}/${filename}`;
      } catch (err: any) {
        console.warn(`upload ${type} error: ${err?.message}`);
        await this.sendNotif(err?.message);
        return err?.message;
      }
      return uploadResult;
    }

    const upload_path: string = `./public/uploads/${folder}/${month}`;
    if (!fs.existsSync(upload_path)) {
      fs.mkdirSync(upload_path, { recursive: true });
    }
    let uploadPath: string = `${upload_path}/${filename}`;
    await file.mv(uploadPath, async function (err: any) {
      if (err) {
        console.warn(`upload ${type} error: ${err?.message}`);
        if (teleConfig?.token) {
          const telegram = new TelegramBot(teleConfig?.token);
          await telegram.send(teleConfig?.chatId, err?.message);
        }
        return err?.message;
      }
    });
    return uploadPath.replace('./public', '');
  }

  public async resize(file: any, fd: string, w: number, h: number = 0) {
    const size: string = `${w}${h == 0 ? '' : '_' + h}`;
    const rename = `${
      file?.name.replace(/ /g, '').split('.')[0]
    }_${size}.${file?.name.split('.').pop()}`;
    const upload_path: string = `./public/uploads/${fd}/${month}`;
    let uploadPath: string = `${upload_path}/${rename}`;
    if (!fs.existsSync(upload_path)) {
      fs.mkdirSync(upload_path, { recursive: true });
    }

    let resize: any = null;
    if (['gallery'].includes(fd)) {
      const metadata = await sharp(path.resolve(file?.tempFilePath)).metadata();
      const width: number = +(metadata?.width || 0);
      const height: number = +(metadata?.height || 0);
      const newWidth: number = Math.round(width / (height / w));

      resize = await sharp(path.resolve(file?.tempFilePath))
        .resize(newWidth, w)
        .toFile(path.resolve(uploadPath));
    } else {
      resize = await sharp(path.resolve(file?.tempFilePath))
        .resize(w, h == 0 ? w : h)
        .toFile(path.resolve(uploadPath));
    }

    return {
      ...resize,
      filename: rename,
      path_doc: uploadPath.replace('./public', ''),
    };
  }

  public async checkDirExport(type: string) {
    const month: string = moment().format('YYYY-MM');
    const path: string = `./public/${type}/${month}`;
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
    }
    return {
      dir: `/${type}/${month}`,
      path: path,
    };
  }

  public async sendNotif(message: string) {
    if (!teleConfig?.token) return 'token not found';
    const telegram = new TelegramBot(teleConfig?.token);
    return await telegram.send(teleConfig?.chatId, message);
  }

  public async catchError(message: string, code: number, res: Response) {
    const msg: string = `${appConfig?.app} - ${message}`;
    await this.sendNotif(msg);
    return response.failed(msg, code, res);
  }

  public async sendEmail(data: Object | any) {
    let tls = {};
    if (mailConfig?.secure) {
      tls = {
        tls: {
          ciphers: 'SSLv3',
        },
      };
    }

    let mailOptions: any;
    if (data?.attachments && data?.attachments?.length > 0) {
      mailOptions = {
        from: `${APP_NAME} ${mailConfig?.sender}`,
        to: data?.to,
        subject: data?.subject,
        html: data?.content,
        attachments: data?.attachments,
      };
    } else {
      mailOptions = {
        from: `${APP_NAME} ${mailConfig?.sender}`,
        to: data?.to,
        subject: data?.subject,
        html: data?.content,
      };
    }

    const transporter = nodemailer.createTransport({
      service: mailConfig?.service,
      host: mailConfig?.host,
      port: mailConfig?.port,
      secure: mailConfig?.secure,
      auth: {
        user: mailConfig?.user,
        pass: mailConfig?.pass,
      },
      logger: mailConfig?.debug,
      ...tls,
    });

    transporter.sendMail(mailOptions, async (error: any, info: any) => {
      if (error) {
        console.warn(`Email error: ${error}`);
        await this.sendNotif(error);
      } else {
        console.warn(`Email sent: ${info?.response}`);
      }
    });
  }

  public slug(string: string) {
    return string
      .replace(/ /g, '-')
      .replace(/[^a-zA-Z0-9-]+/g, '')
      .toLowerCase();
  }

  public async updateUsia() {
    try {
      let result: any;
      if (process.env.DB_DIALECT == POSTGRES) {
        result = await AppResource.sequelize?.query(
          `
          UPDATE app_resource AS ar
          SET usia = subquery.usia
          FROM (
              SELECT resource_id, DATE_PART('year', AGE(CURRENT_DATE, date_of_birth)) AS usia
              FROM app_resource
          ) AS subquery
          WHERE ar.resource_id = subquery.resource_id;
          `,
          { type: QueryTypes.SELECT }
        );
      }
      if (process.env.DB_DIALECT == MYSQL) {
        result = await AppResource.sequelize?.query(
          `
          UPDATE app_resource AS ar
          JOIN (
              SELECT 
                  resource_id, 
                  TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) AS calculated_age
              FROM app_resource
          ) AS subquery ON ar.resource_id = subquery.resource_id
          SET ar.usia = subquery.calculated_age;
        `,
          {
            type: QueryTypes.UPDATE,
          }
        );
      }
      await this.sendNotif(`success update usia: ${result}`);
    } catch (err: any) {
      await this.sendNotif(`failed update usia: ${err?.message}`);
    }
  }

  public async updateClientAge() {
    try {
      let result: any;
      if (process.env.DB_DIALECT == POSTGRES) {
        result = await Client.sequelize?.query(
          `
            UPDATE client AS cl
            SET age = subquery.age
            FROM (
                SELECT id, DATE_PART('year', AGE(CURRENT_DATE, dob)) AS age
                FROM client
            ) AS subquery
            WHERE cl.id = subquery.id;
          `,
          { type: QueryTypes.SELECT }
        );
      }
      if (process.env.DB_DIALECT == MYSQL) {
        result = await Client.sequelize?.query(
          `
          UPDATE client AS cl
          JOIN (
            SELECT 
              id, 
              TIMESTAMPDIFF(YEAR, dob, CURDATE()) AS calculated_age
            FROM client
          ) AS subquery ON cl.id = subquery.id
          SET cl.age = subquery.calculated_age;
        `,
          {
            type: QueryTypes.UPDATE,
          }
        );
      }
      await this.sendNotif(`success update usia client: ${result}`);
    } catch (err: any) {
      await this.sendNotif(`failed update usia client: ${err?.message}`);
    }
  }

  public validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  public isValidUUID(uuid: string) {
    return uuidValidate(uuid) && uuidVersion(uuid) == 4;
  }

  public makeid(length: number): string {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter: number = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  public async fetchLatestCurrency(currency: string = 'USD') {
    let message: string = '';
    try {
      const response = await axios.get(
        `https://api.exchangerate-api.com/v4/latest/${currency}`
      );
      const { base, date, time_last_updated, rates } = response?.data;
      if (rates) {
        const ratesKeys = Object.keys(rates);
        for (let i = 0; i < ratesKeys.length; i++) {
          const key = ratesKeys[i];
          const condition = {
            base: base,
            key: key,
          };
          const check = await repoCurr.detail(condition);
          if (check) {
            await repoCurr.update({
              payload: {
                base,
                key,
                last_update: date,
                time_last_updated: moment(time_last_updated).format('HH:mm:ss'),
                value: rates[key] || 0,
              },
              condition,
            });
          } else {
            await repoCurr.create({
              payload: {
                base,
                key,
                last_update: date,
                time_last_updated: moment(time_last_updated).format('HH:mm:ss'),
                value: rates[key] || 0,
              },
            });
          }
        }
      } else {
        message = 'failed update currency: base not found';
      }
    } catch (err: any) {
      message = `failed update currency: ${err?.message}`;
    }

    try {
      if (message) await this.sendNotif(message);
    } catch (err: any) {
      await this.sendNotif(`failed sendNotif update currency: ${err?.message}`);
    }
    return message;
  }

  public formatIDR(amount: number): string {
    const roundedAmount = Math.round(amount);
    const formattedAmount = roundedAmount
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return formattedAmount;
  }

  public fetchQueryIndex(req: Request) {
    const limit: any = req?.query?.perPage || 10;
    const offset: any = req?.query?.page || 1;
    const keyword: any = req?.query?.q;

    return {
      limit: parseInt(limit),
      offset: parseInt(limit) * (parseInt(offset) - 1),
      keyword,
    };
  }

  public async uploadSmallpict(file: any, options: any = {}) {
    const apiKey: string =
      process.env.SMALLPICT_API_KEY || 'https://api.smallpict.app';
    const secretKey: string = process.env.SMALLPICT_SECRET_KEY || '';
    const baseUrl: string = process.env.SMALLPICT_URL || '';
    const mode: string = (
      options?.mode ||
      process.env.SMALLPICT_MODE ||
      'locale'
    ).toLowerCase();
    const folder: string = options?.folder || 'images';
    const currentMonth: string = moment().format('YYYY-MM');

    if (!apiKey || !secretKey || !baseUrl) {
      throw new Error('SmallPict configuration is incomplete');
    }

    const client = new SmallPict({
      apiKey: apiKey,
      secretKey: secretKey,
      baseUrl: baseUrl,
    });

    // Resolve buffer from input file
    let imageBuffer: Buffer;
    let detectedMimeType: string | null = null;
    let detectedExt: string = 'png';

    if (Buffer.isBuffer(file)) {
      imageBuffer = file;
    } else if (typeof file === 'string' && file.startsWith('data:image/')) {
      const matches = file.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        detectedMimeType = matches[1];
        detectedExt = detectedMimeType.split('/')[1] || 'png';
        imageBuffer = Buffer.from(matches[2], 'base64');
      } else {
        imageBuffer = Buffer.from(file, 'base64');
      }
    } else if (typeof file === 'string' && fs.existsSync(file)) {
      imageBuffer = fs.readFileSync(path.resolve(file));
    } else if (typeof file === 'string') {
      const cleaned = file.trim().replace(/\s/g, '');
      const isBase64 = /^[A-Za-z0-9+/=]+$/.test(cleaned);
      imageBuffer = Buffer.from(cleaned, isBase64 ? 'base64' : 'utf-8');
      if (
        imageBuffer[0] === 0x89 &&
        imageBuffer[1] === 0x50 &&
        imageBuffer[2] === 0x4e &&
        imageBuffer[3] === 0x47
      ) {
        detectedMimeType = 'image/png';
        detectedExt = 'png';
      } else if (
        imageBuffer[0] === 0xff &&
        imageBuffer[1] === 0xd8 &&
        imageBuffer[2] === 0xff
      ) {
        detectedMimeType = 'image/jpeg';
        detectedExt = 'jpg';
      } else if (
        imageBuffer[0] === 0x47 &&
        imageBuffer[1] === 0x49 &&
        imageBuffer[2] === 0x46
      ) {
        detectedMimeType = 'image/gif';
        detectedExt = 'gif';
      } else if (
        imageBuffer.length >= 12 &&
        imageBuffer.toString('ascii', 0, 4) === 'RIFF' &&
        imageBuffer.toString('ascii', 8, 12) === 'WEBP'
      ) {
        detectedMimeType = 'image/webp';
        detectedExt = 'webp';
      }
    } else if (file?.tempFilePath && fs.existsSync(file.tempFilePath)) {
      imageBuffer = fs.readFileSync(path.resolve(file.tempFilePath));
    } else if (file?.data && Buffer.isBuffer(file.data)) {
      imageBuffer = file.data;
    } else if (file?.buffer && Buffer.isBuffer(file.buffer)) {
      imageBuffer = file.buffer;
    } else {
      imageBuffer = Buffer.from(file);
    }

    const rawFilename: string =
      options?.filename ||
      file?.name ||
      file?.filename ||
      file?.originalname ||
      `image.${detectedExt}`;
    const sanitizedFilename: string = rawFilename.replace(/ /g, '');
    const extName: string =
      path.extname(sanitizedFilename) || `.${detectedExt}`;
    const baseName: string = path.basename(sanitizedFilename, extName);
    const timestamp: number = Date.now();
    const filename: string = `${baseName}_${timestamp}${extName}`;
    const mimeType: string =
      options?.mimeType ||
      detectedMimeType ||
      file?.mimetype ||
      file?.mimeType ||
      'image/png';
    const format = options?.format || process.env.SMALLPICT_FORMAT || 'auto';
    const quality =
      options?.quality ||
      (process.env.SMALLPICT_QUALITY
        ? Number(process.env.SMALLPICT_QUALITY)
        : 80);

    const handleCompletedResult = async (finalResult: any) => {
      console.log('🎉 Konversi Berhasil!');
      console.log('Bytes Saved:', finalResult.bytesSaved);

      if (mode === 'cdn') {
        console.log('CDN URL:', finalResult.url);
        return {
          ...finalResult,
          filename: finalResult.filename || filename,
          size_origin: imageBuffer.length,
          originalSize: finalResult.originalSize || imageBuffer.length,
        };
      }

      if (finalResult?.url) {
        try {
          const response = await axios.get(finalResult.url, {
            responseType: 'arraybuffer',
          });
          const optimizedBuffer = Buffer.from(response.data);

          const ext = finalResult.format
            ? `.${finalResult.format}`
            : path.extname(filename) || '.png';
          const baseName = path.basename(filename, path.extname(filename));
          const savedFilename = `${baseName}${ext}`;

          const uploadDir = `./public/uploads/${folder}/${currentMonth}`;
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }

          const localFilePath = `${uploadDir}/${savedFilename}`;
          fs.writeFileSync(path.resolve(localFilePath), optimizedBuffer);
          const relativePath = localFilePath.replace('./public', '');

          console.log('📁 File disimpan di server lokal:', relativePath);

          return {
            ...finalResult,
            url: relativePath,
            path_doc: relativePath,
            cdnUrl: finalResult.url,
            localPath: localFilePath,
            filename: savedFilename,
            size: optimizedBuffer.length,
            compressedSize: optimizedBuffer.length,
            size_origin: imageBuffer.length,
            originalSize: finalResult.originalSize || imageBuffer.length,
          };
        } catch (downloadErr: any) {
          console.error(
            'Gagal mendownload file dari SmallPict ke lokal server:',
            downloadErr?.message
          );
          return finalResult;
        }
      }

      return finalResult;
    };

    const result = await client.optimize(imageBuffer, {
      filename,
      mimeType,
      format,
      quality,
    });

    console.log('Ticket diterima, Job ID:', result.jobId);

    if (result.status === 'completed') {
      return await handleCompletedResult(result);
    }

    if (result.uploadUrl) {
      const uploadRes = await fetch(result.uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': mimeType,
          'Content-Length': String(imageBuffer.length),
        },
        body: new Uint8Array(imageBuffer),
      });
      console.log('Upload S3 Status:', uploadRes.status);

      for (let attempt = 1; attempt <= 15; attempt++) {
        await new Promise((r) => setTimeout(r, 2000));
        const statusResult = await client.getJobStatus(result.jobId);
        console.log(`Polling status attempt ${attempt}:`, statusResult.status);

        if (
          statusResult.status === 'completed' ||
          (statusResult.status as any) === 'succeeded'
        ) {
          return await handleCompletedResult(statusResult);
        }

        if (statusResult.status === 'failed') {
          console.error('Konversi Gagal:', statusResult.error?.message);
          return statusResult;
        }
      }
    }

    return result;
  }
}

export const helper = new Helper();
