'use strict';

import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  CopyObjectCommand,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { s3Client } from './s3.client';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

interface UploadFileParams {
  bucketName: string;
  key: string;
  body: Buffer | Readable | string;
  contentType?: string;
  metadata?: Record<string, string>;
}

interface GetFileParams {
  bucketName: string;
  key: string;
}

interface GeneratePresignedUrlParams {
  bucketName: string;
  key: string;
  expiresIn?: number;
}

export default class S3Service {
  public async uploadFileS3(params: UploadFileParams): Promise<string> {
    const { bucketName, key, body, contentType, metadata } = params;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: body,
      ContentType: contentType,
      Metadata: metadata,
    });

    await s3Client.send(command);
    return `https://${bucketName}.s3.amazonaws.com/${key}`;
  }

  public async getFileS3(params: GetFileParams): Promise<Buffer> {
    const { bucketName, key } = params;

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    const response = await s3Client.send(command);
    return response.Body?.transformToByteArray() as Promise<Buffer>;
  }

  public async generatePresignedUrlS3(
    params: GeneratePresignedUrlParams
  ): Promise<string> {
    const { bucketName, key, expiresIn = 3600 } = params;

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    return getSignedUrl(s3Client, command, { expiresIn });
  }

  public async listFilesS3(
    bucketName: string,
    prefix?: string
  ): Promise<string[]> {
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: prefix,
    });

    const response = await s3Client.send(command);
    return response.Contents?.map((item: any) => item?.Key || '') || [];
  }

  async deleteFileS3(bucketName: string, key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    await s3Client.send(command);
  }

  public async copyFileS3(
    sourceBucket: string,
    sourceKey: string,
    destinationBucket: string,
    destinationKey: string
  ): Promise<void> {
    const command = new CopyObjectCommand({
      CopySource: `${sourceBucket}/${sourceKey}`,
      Bucket: destinationBucket,
      Key: destinationKey,
    });

    await s3Client.send(command);
  }
}

export const s3Service = new S3Service();
