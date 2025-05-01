'use strict';

import { v4 as uuidv4 } from 'uuid';
import Client from '../../insurance/client/client.model';
import { DataTypes, Model, Sequelize } from 'sequelize';

export class Stocks extends Model {
  public stocks_id!: string;
  public stocks_holder!: string;
  public stocks_name!: string;
  public broker!: string;
  public account_number!: string;
  public userid!: string;
  public stock_name!: string;
  public currency!: string;
  public purchase_value!: number;
  public current_value!: number;
  public lot!: number;
  public notes!: string;
  public status!: number;
  public created_by!: string;
  public created_date!: Date;
  public modified_by!: string;
  public modified_date!: Date;
}

export function initStocks(sequelize: Sequelize) {
  Stocks.init(
    {
      stocks_id: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
      },
      stocks_holder: {
        type: DataTypes.STRING,
      },
      stocks_name: {
        type: DataTypes.STRING,
      },
      broker: {
        type: DataTypes.STRING,
      },
      account_number: {
        type: DataTypes.STRING,
      },
      userid: {
        type: DataTypes.STRING,
      },
      stock_name: {
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
      lot: {
        type: DataTypes.DECIMAL,
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
      modelName: 'Stocks',
      tableName: 'stocks',
      timestamps: false,
    }
  );

  Stocks.beforeCreate((stocks) => {
    stocks?.setDataValue('stocks_id', uuidv4());
  });
  return Stocks;
}

export function associateStocks() {
  Stocks.belongsTo(Client, { as: 'holder', foreignKey: 'stocks_holder' });
}

export default Stocks;
