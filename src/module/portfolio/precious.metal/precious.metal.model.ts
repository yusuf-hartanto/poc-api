'use strict';

import { v4 as uuidv4 } from 'uuid';
import Client from '../../insurance/client/client.model';
import { DataTypes, Model, Sequelize } from 'sequelize';

export class PreciousMetal extends Model {
  public precious_metal_id!: string;
  public precious_metal_holder!: string;
  public precious_metal_name!: string;
  public type!: string;
  public amount!: number;
  public unit!: string;
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

export function initPreciousMetal(sequelize: Sequelize) {
  PreciousMetal.init(
    {
      precious_metal_id: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
      },
      precious_metal_holder: {
        type: DataTypes.STRING,
      },
      precious_metal_name: {
        type: DataTypes.STRING,
      },
      type: {
        type: DataTypes.STRING,
      },
      amount: {
        type: DataTypes.DECIMAL,
      },
      unit: {
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
      modelName: 'PreciousMetal',
      tableName: 'precious_metal',
      timestamps: false,
    }
  );

  PreciousMetal.beforeCreate((precious_metal) => {
    precious_metal?.setDataValue('precious_metal_id', uuidv4());
  });
  return PreciousMetal;
}

export function associatePreciousMetal() {
  PreciousMetal.belongsTo(Client, {
    as: 'holder',
    foreignKey: 'precious_metal_holder',
  });
}

export default PreciousMetal;
