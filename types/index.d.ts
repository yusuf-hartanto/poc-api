declare namespace Express {
  interface Request {
    user?: any;
    files?: any;
  }
}
declare module 'express-xss-sanitizer' {
  import { RequestHandler } from 'express';
  export function xss(): RequestHandler;
}
