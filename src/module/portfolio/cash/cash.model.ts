'use strict';

import { v4 as uuidv4 } from 'uuid';
import Client from '../../insurance/client/client.model';
import { DataTypes, Model, Sequelize } from 'sequelize';

export class Cash extends Model {
  public cash_id!: string;
  public cash_holder!: string;
  public cash_name!: string;
  public type!: string;
  public product_number!: string;
  public bank_name!: string;
  public start_date!: Date;
  public maturity_date!: Date;
  public currency!: string;
  public amount!: number;
  public payor!: number;
  public payee!: number;
  public aro!: number;
  public location!: string;
  public notes!: string;
  public status!: number;
  public created_by!: string;
  public created_date!: Date;
  public modified_by!: string;
  public modified_date!: Date;
}

export function initCash(sequelize: Sequelize) {
  Cash.init(
    {
      cash_id: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
      },
      cash_holder: {
        type: DataTypes.STRING,
      },
      cash_name: {
        type: DataTypes.STRING,
      },
      type: {
        type: DataTypes.STRING,
      },
      product_number: {
        type: DataTypes.STRING,
      },
      bank_name: {
        type: DataTypes.STRING,
      },
      start_date: {
        type: DataTypes.DATEONLY,
      },
      maturity_date: {
        type: DataTypes.DATEONLY,
      },
      currency: {
        type: DataTypes.STRING,
      },
      amount: {
        type: DataTypes.DECIMAL,
      },
      payor: {
        type: DataTypes.DECIMAL,
      },
      payee: {
        type: DataTypes.DECIMAL,
      },
      aro: {
        type: DataTypes.DECIMAL,
      },
      location: {
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
      modelName: 'Cash',
      tableName: 'cash',
      timestamps: false,
    }
  );

  Cash.beforeCreate((cash) => {
    cash?.setDataValue('cash_id', uuidv4());
  });
  return Cash;
}

export function associateCash() {
  Cash.belongsTo(Client, { as: 'holder', foreignKey: 'cash_holder' });
}

export default Cash;
