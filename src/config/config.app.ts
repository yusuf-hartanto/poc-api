'use strict';

interface AppConfig {
  app: string;
  appEnv: string;
  port: number;
  assetType: string;
  baseDomain: string;
  baseUrlFe: string;
}

let appConfig: AppConfig;

export function initializeApp(data: any) {
  if (appConfig) return appConfig;

  appConfig = {
    app: data?.app || 'Meta Advisor',
    appEnv: data?.appEnv || 'development',
    port: data?.port || 5000,
    assetType: data?.assetType || 'local',
    baseDomain: data?.baseDomain || 'metaadvisor.id',
    baseUrlFe: data?.baseUrlFe || 'http://localhost:3000',
  };

  return appConfig;
}

export { appConfig };
