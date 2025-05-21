'use strict';

import { v4 as uuidv4 } from 'uuid';
import Client from '../../insurance/client/client.model';
import { DataTypes, Model, Sequelize } from 'sequelize';

export class Bonds extends Model {
  public bonds_id!: string;
  public bonds_holder!: string;
  public bonds_name!: string;
  public type!: string;
  public product_number!: string;
  public issuer_name!: string;
  public issuer_date!: Date;
  public maturity_date!: Date;
  public currency!: string;
  public amount!: number;
  public interest_rate!: number;
  public notes!: string;
  public status!: number;
  public created_by!: string;
  public created_date!: Date;
  public modified_by!: string;
  public modified_date!: Date;
}

export function initBonds(sequelize: Sequelize) {
  Bonds.init(
    {
      bonds_id: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
      },
      bonds_holder: {
        type: DataTypes.STRING,
      },
      bonds_name: {
        type: DataTypes.STRING,
      },
      type: {
        type: DataTypes.STRING,
      },
      broker: {
        type: DataTypes.STRING,
      },
      product_number: {
        type: DataTypes.STRING,
      },
      issuer_name: {
        type: DataTypes.STRING,
      },
      issuer_date: {
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
      interest_rate: {
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
      modelName: 'Bonds',
      tableName: 'bonds',
      timestamps: false,
    }
  );

  Bonds.beforeCreate((bonds) => {
    bonds?.setDataValue('bonds_id', uuidv4());
  });
  return Bonds;
}

export function associateBonds() {
  Bonds.belongsTo(Client, { as: 'holder', foreignKey: 'bonds_holder' });
}

export default Bonds;
