'use strict';

import { v4 as uuidv4 } from 'uuid';
import Client from '../../insurance/client/client.model';
import { DataTypes, Model, Sequelize } from 'sequelize';

export class DigitalAssets extends Model {
  public digital_assets_id!: string;
  public digital_assets_holder!: string;
  public digital_assets_name!: string;
  public type!: string;
  public selling_agent!: string;
  public serial_number!: string;
  public account_number!: string;
  public userid!: string;
  public currency!: string;
  public purchase_value!: number;
  public current_value!: number;
  public location!: string;
  public doc_location!: string;
  public notes!: string;
  public status!: number;
  public created_by!: string;
  public created_date!: Date;
  public modified_by!: string;
  public modified_date!: Date;
}

export function initDigitalAssets(sequelize: Sequelize) {
  DigitalAssets.init(
    {
      digital_assets_id: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
      },
      digital_assets_holder: {
        type: DataTypes.STRING,
      },
      digital_assets_name: {
        type: DataTypes.STRING,
      },
      type: {
        type: DataTypes.STRING,
      },
      selling_agent: {
        type: DataTypes.STRING,
      },
      serial_number: {
        type: DataTypes.STRING,
      },
      account_number: {
        type: DataTypes.STRING,
      },
      userid: {
        type: DataTypes.STRING,
      },
      currency: {
        type: DataTypes.STRING,
      },
      purchase_value: {
        type: DataTypes.DECIMAL,
      },
      current_value: {
        type: DataTypes.DECIMAL,
      },
      location: {
        type: DataTypes.STRING,
      },
      doc_location: {
        type: DataTypes.STRING,
      },
      notes: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.TINYINT,
        defaultValue: 1,
      },
      created_by: {
        type: DataTypes.STRING,
      },
      created_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      modified_by: {
        type: DataTypes.STRING,
      },
      modified_date: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: 'DigitalAssets',
      tableName: 'digital_assets',
      timestamps: false,
    }
  );

  DigitalAssets.beforeCreate((digital_assets) => {
    digital_assets?.setDataValue('digital_assets_id', uuidv4());
  });
  return DigitalAssets;
}

export function associateDigitalAssets() {
  DigitalAssets.belongsTo(Client, {
    as: 'holder',
    foreignKey: 'digital_assets_holder',
  });
}

export default DigitalAssets;
