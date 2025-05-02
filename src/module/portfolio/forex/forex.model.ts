'use strict';

import { v4 as uuidv4 } from 'uuid';
import Client from '../../insurance/client/client.model';
import { DataTypes, Model, Sequelize } from 'sequelize';

export class Forex extends Model {
  public forex_id!: string;
  public forex_holder!: string;
  public forex_name!: string;
  public broker!: string;
  public account_number!: string;
  public userid!: string;
  public coin_name!: string;
  public coin_amount!: number;
  public currency!: string;
  public purchase_value!: number;
  public current_value!: number;
  public notes!: string;
  public status!: number;
  public created_by!: string;
  public created_date!: Date;
  public modified_by!: string;
  public modified_date!: Date;
}

export function initForex(sequelize: Sequelize) {
  Forex.init(
    {
      forex_id: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
      },
      forex_holder: {
        type: DataTypes.STRING,
      },
      forex_name: {
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
      coin_name: {
        type: DataTypes.STRING,
      },
      coin_amount: {
        type: DataTypes.DECIMAL,
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
      modelName: 'Forex',
      tableName: 'forex',
      timestamps: false,
    }
  );

  Forex.beforeCreate((forex) => {
    forex?.setDataValue('forex_id', uuidv4());
  });
  return Forex;
}

export function associateForex() {
  Forex.belongsTo(Client, { as: 'holder', foreignKey: 'forex_holder' });
}

export default Forex;
