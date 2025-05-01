'use strict';

import dotenv from 'dotenv';
import {
  SSMClient,
  GetParameterCommand,
  PutParameterCommand,
} from '@aws-sdk/client-ssm';

dotenv.config();

interface ParameterStoreOptions {
  region?: string;
  prefix?: string;
}

export class ParameterStoreService {
  private client: SSMClient;
  private prefix: string;

  constructor(options: ParameterStoreOptions = {}) {
    this.client = new SSMClient({
      region: options.region || process.env.AWS_REGION || 'ap-southeast-3',
    });
    this.prefix =
      options.prefix || process.env.AWS_PARAMETER_STORE_PREFIX || '';
  }

  async getObject<T extends Record<string, any>>(path: string): Promise<T> {
    const fullPath = `/${this.prefix}/${path}`;

    const command = new GetParameterCommand({
      Name: fullPath,
      WithDecryption: true,
    });

    try {
      const response = await this.client.send(command);
      if (!response.Parameter?.Value) {
        throw new Error(`Parameter ${fullPath} not found or has no value`);
      }

      return JSON.parse(response.Parameter.Value) as T;
    } catch (error) {
      console.error(`Error getting parameter ${fullPath}:`, error);
      throw error;
    }
  }

  async putObject(
    path: string,
    value: object,
    secure: boolean = true
  ): Promise<void> {
    const fullPath = `${this.prefix}${path}`;
    const stringValue = JSON.stringify(value);

    const command = new PutParameterCommand({
      Name: fullPath,
      Value: stringValue,
      Type: secure ? 'SecureString' : 'String',
      Overwrite: true,
    });

    try {
      await this.client.send(command);
      console.log(`Successfully stored parameter at ${fullPath}`);
    } catch (error) {
      console.error(`Error storing parameter ${fullPath}:`, error);
      throw error;
    }
  }
}

const parameterStore = new ParameterStoreService();
export default parameterStore;
