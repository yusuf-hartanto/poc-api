'use strict';

import { v4 as uuidv4 } from 'uuid';
import { DataTypes, Model, Sequelize } from 'sequelize';

export class Image extends Model {
  public id!: string;
  public filename!: string;
  public url!: string;
  public size!: number;
  public size_origin!: number;
  public mime_type!: string;
  public created_at!: Date;
}

export function initImage(sequelize: Sequelize) {
  Image.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
      },
      filename: {
        type: DataTypes.STRING,
      },
      url: {
        type: DataTypes.TEXT,
      },
      size: {
        type: DataTypes.BIGINT,
      },
      size_origin: {
        type: DataTypes.BIGINT,
      },
      mime_type: {
        type: DataTypes.STRING,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Image',
      tableName: 'images',
      timestamps: false,
    }
  );

  Image.beforeCreate((image) => {
    if (!image.getDataValue('id')) {
      image.setDataValue('id', uuidv4());
    }
  });
  return Image;
}

export function associateImage() {}

export default Image;
