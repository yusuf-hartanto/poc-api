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

  public checkExtention(file: File, type: string = 'image') {
    if (type == 'image' && file?.size > 2048000)
      return 'file size maksimal *2MB.';
    const allowedExt: any = {
      image: ['jpg', 'jpeg', 'png', 'gif'],
      video: ['mp4', 'webm', 'avi', 'mkv', 'mov', 'flv', 'mts', 'wmv'],
      file: ['pdf', 'txt', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'],
    };
    let ext: string = file?.name.split('.').pop() || '-';
    if (allowedExt[type].includes(ext.toLocaleLowerCase())) return 'allowed';
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
}

export const helper = new Helper();
