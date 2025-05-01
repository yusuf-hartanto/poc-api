'use strict';

interface AWSConfig {
  region: string;
  username: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
  prefix: string;
}

let awsConfig: AWSConfig;

export function initializeAWS(data: any) {
  if (awsConfig) return awsConfig;

  awsConfig = {
    region: data?.region || 'ap-southeast-3',
    username: data?.username || 'username',
    bucket: data?.bucket || 'bucket',
    accessKeyId: data?.accessKeyId || 'key_id',
    secretAccessKey: data?.secretAccessKey || 'secret_key',
    prefix: data?.prefix || 'prefix',
  };

  return awsConfig;
}

export { awsConfig };
