'use strict';

import dotenv from 'dotenv';
import moment from 'moment';
import ExcelJS from 'exceljs';
import puppeteer from 'puppeteer';
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

const fetchDataDashboard = async (req: Request) => {
  const client: any = req?.query?.client;
  const role: string = req?.user?.role_name;
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
    ['up_jiwa', 'rs', 'penyakit_kritis', 'pensiun', 'dijamin'].includes(flag)
  ) {
    benefit = flag;
  }

  const result = await repoPolicy.list(
    {
      keyword: keyword,
      condition: condition,
    },
    false,
    benefit
  );
  return result;
};

const generateHeaderExcel = (sheet: any, data: any) => {
  sheet.addRow([data?.title]);
  sheet.mergeCells(data?.start + '1', data?.end + '1');
  sheet.mergeCells(data?.start + '2', data?.end + '2');
  sheet.getRow(1).eachCell({ includeEmpty: true }, (cell: any) => {
    cell.alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true,
    };
  });
  sheet.getRow(1).eachCell((cell: any) => {
    cell.font = { bold: true };
  });
};

const generateDataExcel = (sheet: any, details: any) => {
  let headers = [
    'No',
    'Policy Number',
    'Provider Company',
    'Product Name',
    'Policy Holder',
    'Insured Holder',
    'Beneficiary Holder',
    'Issued Date',
    'Payment Term',
    'Premi Value',
    'Premi IDR',
  ];
  sheet.addRow(headers);
  for (let i in details) {
    sheet.addRow([
      parseInt(i) + 1,
      details[i]?.policy_number,
      details[i]?.provider_company,
      details[i]?.product_name,
      details[i]?.policy_holder_name,
      details[i]?.insured_holder_name,
      details[i]?.beneficiary_holder_name,
      details[i]?.issued_date,
      details[i]?.payment_term
        ? `${details[i]?.payment_term} ${details[i]?.payment_term_unit}`
        : details[i]?.payment_term_unit,
      `${details[i]?.premi_currency} ${helper.formatIDR(details[i]?.premi_value)}`,
      `IDR ${helper.formatIDR(details[i]?.total_premi)}`,
    ]);
  }
  sheet.getRow(3).eachCell((cell: any) => {
    cell.font = { bold: true };
  });
  return sheet;
};

const generateHtmlPDF = (title: string, details: any) => {
  let html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            font-size: 12px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid black;
            padding: 8px;
            text-align: center;
          }
          th {
            background-color: #f2f2f2;
          }
        </style>
      </head>
      <body>
        <h2 style="text-align: center;">${title}</h2>
        <table>
          <tr>
            <th>No</th>
            <th>Policy Number</th>
            <th>Provider Company</th>
            <th>Product Name</th>
            <th>Policy Holder</th>
            <th>Insured Holder</th>
            <th>Beneficiary Holder</th>
            <th>Issued Date</th>
            <th>Payment Term</th>
            <th>Premi Value</th>
            <th>Premi IDR</th>
          </tr>
  `;
  for (let i in details) {
    html += `
      <tr>
        <td>${parseInt(i) + 1}</td>
        <td>${details[i]?.policy_number}</td>
        <td>${details[i]?.provider_company}</td>
        <td>${details[i]?.product_name}</td>
        <td>${details[i]?.policy_holder_name}</td>
        <td>${details[i]?.insured_holder_name}</td>
        <td>${details[i]?.beneficiary_holder_name}</td>
        <td>${details[i]?.issued_date}</td>
        <td>
          ${
            details[i]?.payment_term
              ? `${details[i]?.payment_term} ${details[i]?.payment_term_unit}`
              : details[i]?.payment_term_unit
          }
        </td>
        <td>${details[i]?.premi_currency} ${helper.formatIDR(details[i]?.premi_value)}</td>
        <td>IDR ${helper.formatIDR(details[i]?.total_premi)}</td>
      </tr>
    `;
  }
  html += `
        </table>
      </body>
    </html>
  `;
  return html;
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

  public async dashboardExcel(req: Request, res: Response) {
    try {
      const flag: any = req?.query?.flag;

      const result = await fetchDataDashboard(req);
      if (result?.length < 1)
        return response.failed('Data not found', 404, res);
      const policy = await transformerPolicy.list(result);

      const { dir, path } = await helper.checkDirExport('excel');

      const filename: string = `${flag}-${moment().format('DDMMYYYY')}.xlsx`;
      const title: string = `DATA ${flag.replace(/_/g, ' ').toUpperCase()}`;
      const urlExcel: string = `${dir}/${filename}`;
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet(title);

      generateHeaderExcel(sheet, {
        start: 'A',
        end: 'K',
        title: title,
      });
      generateDataExcel(sheet, policy);
      await workbook.xlsx.writeFile(`${path}/${filename}`);
      return response.success('export excel dashboard', urlExcel, res);
    } catch (err: any) {
      return helper.catchError(
        `export excel dashboard: ${err?.message}`,
        500,
        res
      );
    }
  }

  public async dashboardPDF(req: Request, res: Response) {
    try {
      const flag: any = req?.query?.flag;

      const result = await fetchDataDashboard(req);
      if (result?.length < 1)
        return response.failed('Data not found', 404, res);
      const policy = await transformerPolicy.list(result);

      const { dir, path } = await helper.checkDirExport('pdf');

      const filename: string = `${flag}-${moment().format('DDMMYYYY')}.pdf`;
      const title: string = `DATA ${flag.replace(/_/g, ' ').toUpperCase()}`;
      const urlPDF: string = `${dir}/${filename}`;

      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      const htmlContent = generateHtmlPDF(title, policy);
      await page.setContent(htmlContent);
      await page.pdf({
        path: `${path}/${filename}`,
        format: 'A4',
        landscape: true,
      });
      await browser.close();

      return response.success('export pdf dashboard', urlPDF, res);
    } catch (err: any) {
      return helper.catchError(
        `export pdf dashboard: ${err?.message}`,
        500,
        res
      );
    }
  }
}

export const global = new Controller();
