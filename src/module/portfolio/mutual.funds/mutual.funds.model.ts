'use strict';

import { v4 as uuidv4 } from 'uuid';
import Client from '../../insurance/client/client.model';
import { DataTypes, Model, Sequelize } from 'sequelize';

export class MutualFunds extends Model {
  public mutual_funds_id!: string;
  public mutual_funds_holder!: string;
  public mutual_funds_name!: string;
  public type!: string;
  public fund_manager!: string;
  public maturity_date!: Date;
  public purchase_date!: Date;
  public purchase_value!: number;
  public currency!: string;
  public current_value!: number;
  public selling_agent!: string;
  public notes!: string;
  public status!: number;
  public created_by!: string;
  public created_date!: Date;
  public modified_by!: string;
  public modified_date!: Date;
}

export function initMutualFunds(sequelize: Sequelize) {
  MutualFunds.init(
    {
      mutual_funds_id: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
      },
      mutual_funds_holder: {
        type: DataTypes.STRING,
      },
      mutual_funds_name: {
        type: DataTypes.STRING,
      },
      type: {
        type: DataTypes.STRING,
      },
      fund_manager: {
        type: DataTypes.STRING,
      },
      maturity_date: {
        type: DataTypes.DATEONLY,
      },
      purchase_date: {
        type: DataTypes.DATEONLY,
      },
      purchase_value: {
        type: DataTypes.DECIMAL,
      },
      currency: {
        type: DataTypes.STRING,
      },
      current_value: {
        type: DataTypes.DECIMAL,
      },
      selling_agent: {
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
      modelName: 'MutualFunds',
      tableName: 'mutual_funds',
      timestamps: false,
    }
  );

  MutualFunds.beforeCreate((mutual_funds) => {
    mutual_funds?.setDataValue('mutual_funds_id', uuidv4());
  });
  return MutualFunds;
}

export function associateMutualFunds() {
  MutualFunds.belongsTo(Client, {
    as: 'holder',
    foreignKey: 'mutual_funds_holder',
  });
}

export default MutualFunds;
