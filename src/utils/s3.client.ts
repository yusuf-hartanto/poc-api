'use strict';

import { awsConfig } from '../config/config.aws';
import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3';

const s3Config: S3ClientConfig = {
  region: awsConfig?.region || 'ap-southeast-3',
  credentials: {
    accessKeyId: awsConfig?.accessKeyId!,
    secretAccessKey: awsConfig?.secretAccessKey!,
  },
};

export const s3Client = new S3Client(s3Config);
