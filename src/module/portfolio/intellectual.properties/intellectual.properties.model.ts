'use strict';

import { v4 as uuidv4 } from 'uuid';
import Client from '../../insurance/client/client.model';
import { DataTypes, Model, Sequelize } from 'sequelize';

export class IntellectualProperties extends Model {
  public intellectual_properties_id!: string;
  public intellectual_properties_holder!: string;
  public intellectual_properties_name!: string;
  public type!: string;
  public creation_date!: Date;
  public appraised_value!: number;
  public appraised_name!: string;
  public contract_number!: string;
  public notes!: string;
  public status!: number;
  public created_by!: string;
  public created_date!: Date;
  public modified_by!: string;
  public modified_date!: Date;
}

export function initIntellectualProperties(sequelize: Sequelize) {
  IntellectualProperties.init(
    {
      intellectual_properties_id: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
      },
      intellectual_properties_holder: {
        type: DataTypes.STRING,
      },
      intellectual_properties_name: {
        type: DataTypes.STRING,
      },
      type: {
        type: DataTypes.STRING,
      },
      creation_date: {
        type: DataTypes.DATEONLY,
      },
      appraised_value: {
        type: DataTypes.DECIMAL,
      },
      appraised_name: {
        type: DataTypes.STRING,
      },
      contract_number: {
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
      modelName: 'IntellectualProperties',
      tableName: 'intellectual_properties',
      timestamps: false,
    }
  );

  IntellectualProperties.beforeCreate((intellectual_properties) => {
    intellectual_properties?.setDataValue(
      'intellectual_properties_id',
      uuidv4()
    );
  });
  return IntellectualProperties;
}

export function associateIntellectualProperties() {
  IntellectualProperties.belongsTo(Client, {
    as: 'holder',
    foreignKey: 'intellectual_properties_holder',
  });
}

export default IntellectualProperties;
