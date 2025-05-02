'use strict';

import { v4 as uuidv4 } from 'uuid';
import { DataTypes, Model, Sequelize } from 'sequelize';

export class Currency extends Model {
  public id!: string;
  public base!: string;
  public key!: string;
  public value!: number;
  public last_update!: Date;
  public time_last_updated!: string;
}

export function initCurrency(sequelize: Sequelize) {
  Currency.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      base: {
        type: DataTypes.STRING,
        unique: true,
      },
      key: {
        type: DataTypes.STRING,
      },
      value: {
        type: DataTypes.DECIMAL,
      },
      last_update: {
        type: DataTypes.DATEONLY,
      },
      time_last_updated: {
        type: DataTypes.TIME,
      },
    },
    {
      sequelize,
      modelName: 'Currency',
      tableName: 'currency',
      timestamps: false,
    }
  );

  Currency.beforeCreate((currency) => {
    currency?.setDataValue('id', uuidv4());
  });
  return Currency;
}

export function associateCurrency() {}

export default Currency;
