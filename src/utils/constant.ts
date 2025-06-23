'use strict';

import dotenv from 'dotenv';

dotenv.config();

// config
export const APP_NAME: string = process.env.APP || 'Meta Advisor';
export const PRODUCTION: string = 'production';
export const DEVELOPMENT: string = 'development';

// role
export const ROLE_ADMIN: string = 'administrator';
export const ROLE_AGENT: string = 'agent';
export const ROLE_CLIENT: string = 'client';

// response
export const INVALID: string = 'is invalid';
export const REQUIRED: string = 'is required';
export const NOT_FOUND: string = 'Data not found';
export const ALREADY_EXIST: string = 'Data already exists';
export const SUCCESS_SAVED: string = 'Data successfully saved';
export const SUCCESS_UPDATED: string = 'Data successfully updated';
export const SUCCESS_DELETED: string = 'Data successfully deleted';
export const SUCCESS_RETRIEVED: string = 'Data successfully retrieved';
export const SUCCESS_PDF: string = 'Export PDF successfully';
export const SUCCESS_EXCEL: string = 'Export Excel successfully';
export const ALLOWED_EXPORT: string = 'Allowed export pdf or excel';

// database
export const MYSQL: string = 'mysql';
export const POSTGRES: string = 'postgres';

// insurance
export const INS_RS: string = 'rs';
export const INS_UP_JIWA: string = 'up_jiwa';
export const INS_PENSIUN: string = 'pensiun';
export const INS_DIJAMIN: string = 'dijamin';
export const INS_TOTAL_PREMI: string = 'total_premi';
export const INS_PENYAKIT_KRITIS: string = 'penyakit_kritis';
