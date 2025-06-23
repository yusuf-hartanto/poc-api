'use strict';

import moment from 'moment';
import ExcelJS from 'exceljs';
import puppeteer from 'puppeteer';
import { helper } from './helper';
import { SUCCESS_EXCEL, SUCCESS_PDF } from '../utils/constant';

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

const generateDataExcel = (sheet: any, keys: any, details: any) => {
  sheet.addRow(Object.values(keys));

  for (let row = 1; row <= 3; row++) {
    sheet.getRow(row).eachCell((cell: any) => {
      cell.font = { bold: true };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });
    if (row > 2) {
      sheet.getRow(row).eachCell((cell: any) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF00FF00' }, // Green color
        };
      });
    }
  }

  for (const i in details) {
    const result: any = [];
    Object.keys(keys).forEach((key) => {
      if (key === 'no') {
        result.push(parseInt(i) + 1);
      } else if (details[i].hasOwnProperty(key)) {
        const value = details[i][key] || '';

        if (
          key.includes('value') ||
          key.includes('amount') ||
          key.includes('total')
        ) {
          result.push(helper.formatIDR(value));
        } else if (key.includes('date')) {
          result.push(moment(value).format('YYYY-MM-DD'));
        } else if (key.includes('status')) {
          result.push(value ? 'Active' : 'Deactive');
        } else if (key.includes('flag_client')) {
          result.push(value == '1' ? 'Yes' : 'No');
        } else {
          result.push(value);
        }
      } else {
        result.push('');
      }
    });
    sheet.addRow(result);
  }

  for (let row = 3; row <= details?.length + 4; row++) {
    sheet.getRow(row).eachCell((cell: any) => {
      cell.border = {
        top: { style: 'thin', color: { argb: 'FF000000' } },
        left: { style: 'thin', color: { argb: 'FF000000' } },
        bottom: { style: 'thin', color: { argb: 'FF000000' } },
        right: { style: 'thin', color: { argb: 'FF000000' } },
      };
    });
  }

  return sheet;
};

const generateHtmlPDF = (title: string, keys: any, details: any) => {
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
  `;
  for (const k in keys) {
    html += `<th>${keys[k]}</th>`;
  }
  html += `</tr>`;

  for (const i in details) {
    html += `<tr>`;
    Object.keys(keys).forEach((key) => {
      if (key === 'no') {
        html += `<td>${parseInt(i) + 1}</td>`;
      } else if (details[i].hasOwnProperty(key)) {
        const value = details[i][key] || '';

        if (
          key.includes('value') ||
          key.includes('amount') ||
          key.includes('total')
        ) {
          html += `<td>${helper.formatIDR(value)}</td>`;
        } else if (key.includes('date')) {
          html += `<td>${moment(value).format('YYYY-MM-DD')}</td>`;
        } else if (key.includes('status')) {
          html += `<td>${value ? 'Active' : 'Deactive'}</td>`;
        } else if (key.includes('flag_client')) {
          html += `<td>${value == '1' ? 'Yes' : 'No'}</td>`;
        } else {
          html += `<td>${value}</td>`;
        }
      } else {
        html += `<td></td>`;
      }
    });
    html += `</tr>`;
  }
  html += `
        </table>
      </body>
    </html>
  `;
  return html;
};

export default class ExportHelper {
  public async excel(setup: any, data: any) {
    try {
      const { dir, path } = await helper.checkDirExport('excel');

      const filename: string = `${setup?.name}-${moment().format('DDMMYYYY')}.xlsx`;
      const title: string = `DATA ${setup?.name.replace(/[_-]/g, ' ').toUpperCase()}`;
      const urlExcel: string = `${dir}/${filename}`;
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet(title);

      generateHeaderExcel(sheet, {
        start: setup?.start || 'A',
        end: setup?.end || 'Z',
        title: title,
      });
      generateDataExcel(sheet, setup?.keys, data);
      await workbook.xlsx.writeFile(`${path}/${filename}`);

      return {
        status: true,
        message: SUCCESS_EXCEL,
        url: urlExcel,
      };
    } catch (err: any) {
      return {
        status: false,
        message: err?.message,
      };
    }
  }

  public async pdf(setup: any, data: any) {
    try {
      const { dir, path } = await helper.checkDirExport('pdf');

      const filename: string = `${setup?.name}-${moment().format('DDMMYYYY')}.pdf`;
      const title: string = `DATA ${setup?.name.replace(/[_-]/g, ' ').toUpperCase()}`;
      const urlPDF: string = `${dir}/${filename}`;

      const browser = await puppeteer.launch({
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage', // Avoids /dev/shm issues in Docker
          '--disable-accelerated-2d-canvas',
          '--disable-gpu', // Disable GPU hardware acceleration
          '--remote-debugging-port=9222',
        ],
      });
      const page = await browser.newPage();

      const htmlContent = generateHtmlPDF(title, setup?.keys, data);
      await page.setContent(htmlContent);
      await page.pdf({
        path: `${path}/${filename}`,
        format: 'A4',
        landscape: true,
      });
      await browser.close();

      return {
        status: true,
        message: SUCCESS_PDF,
        url: urlPDF,
      };
    } catch (err: any) {
      return {
        status: false,
        message: err?.message,
      };
    }
  }
}

export const hExport = new ExportHelper();
