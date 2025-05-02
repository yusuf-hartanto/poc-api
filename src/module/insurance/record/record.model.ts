'use strict';

import { v4 as uuidv4 } from 'uuid';
import Policy from '../policy/policy.model';
import Client from '../client/client.model';
import { DataTypes, Model, Sequelize } from 'sequelize';

export class Record extends Model {
  public id!: string;
  public policy_id!: string;
  public client_id!: number;
  public notification_date!: Date;
  public notification_type!: string;
  public created_by!: string;
  public created_date!: Date;
  public modified_by!: string;
  public modified_date!: Date;
}

export function initRecord(sequelize: Sequelize) {
  Record.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
      },
      policy_id: {
        type: DataTypes.STRING,
      },
      client_id: {
        type: DataTypes.STRING,
      },
      notification_date: {
        type: DataTypes.STRING,
      },
      notification_type: {
        type: DataTypes.STRING,
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
      modelName: 'Record',
      tableName: 'insurance_record',
      timestamps: false,
    }
  );

  Record.beforeCreate((insurance_record) => {
    insurance_record?.setDataValue('id', uuidv4());
  });
  return Record;
}

export function associateRecord() {
  Record.belongsTo(Policy, { as: 'policy', foreignKey: 'policy_id' });
  Record.belongsTo(Client, { as: 'client', foreignKey: 'client_id' });
}

export default Record;
