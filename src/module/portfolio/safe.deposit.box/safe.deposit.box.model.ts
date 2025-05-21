'use strict';

import { v4 as uuidv4 } from 'uuid';
import Client from '../../insurance/client/client.model';
import { DataTypes, Model, Sequelize } from 'sequelize';

export class SafeDepositBox extends Model {
  public sdb_id!: string;
  public name!: string;
  public location!: string;
  public address!: string;
  public status!: number;
  public created_by!: string;
  public created_date!: Date;
  public modified_by!: string;
  public modified_date!: Date;
}

export function initSafeDepositBox(sequelize: Sequelize) {
  SafeDepositBox.init(
    {
      sdb_id: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
      },
      sdb_holder: {
        type: DataTypes.STRING,
      },
      name: {
        type: DataTypes.STRING,
      },
      location: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.STRING,
      },
      flag_sdb: {
        type: DataTypes.TINYINT,
        defaultValue: 1,
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
      modelName: 'SafeDepositBox',
      tableName: 'safe_deposit_box',
      timestamps: false,
    }
  );

  SafeDepositBox.beforeCreate((safe_deposit_box) => {
    safe_deposit_box?.setDataValue('sdb_id', uuidv4());
  });
  return SafeDepositBox;
}

export function associateSafeDepositBox() {
  SafeDepositBox.belongsTo(Client, {
    as: 'holder',
    foreignKey: 'sdb_holder',
  });
}

export default SafeDepositBox;
