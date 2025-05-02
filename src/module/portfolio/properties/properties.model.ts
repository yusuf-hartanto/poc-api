'use strict';

import { v4 as uuidv4 } from 'uuid';
import Client from '../../insurance/client/client.model';
import { DataTypes, Model, Sequelize } from 'sequelize';

export class Properties extends Model {
  public properties_id!: string;
  public properties_holder!: string;
  public properties_name!: string;
  public type!: string;
  public ownership!: string;
  public certificate_number!: string;
  public address!: string;
  public purchase_date!: Date;
  public currency!: string;
  public purchase_value!: number;
  public current_value!: number;
  public land_area!: string;
  public building_area!: number;
  public location!: string;
  public doc_location!: string;
  public notes!: string;
  public status!: number;
  public created_by!: string;
  public created_date!: Date;
  public modified_by!: string;
  public modified_date!: Date;
}

export function initProperties(sequelize: Sequelize) {
  Properties.init(
    {
      properties_id: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
      },
      properties_holder: {
        type: DataTypes.STRING,
      },
      properties_name: {
        type: DataTypes.STRING,
      },
      type: {
        type: DataTypes.STRING,
      },
      ownership: {
        type: DataTypes.STRING,
      },
      certificate_number: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.STRING,
      },
      purchase_date: {
        type: DataTypes.DATEONLY,
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
      land_area: {
        type: DataTypes.DECIMAL,
      },
      building_area: {
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
      modelName: 'Properties',
      tableName: 'properties',
      timestamps: false,
    }
  );

  Properties.beforeCreate((properties) => {
    properties?.setDataValue('properties_id', uuidv4());
  });
  return Properties;
}

export function associateProperties() {
  Properties.belongsTo(Client, {
    as: 'holder',
    foreignKey: 'properties_holder',
  });
}

export default Properties;
