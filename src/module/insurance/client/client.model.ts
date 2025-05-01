'use strict';

import { v4 as uuidv4 } from 'uuid';
import { DataTypes, Model, Sequelize } from 'sequelize';

export class Client extends Model {
  public id!: string;
  public cin!: string;
  public name!: string;
  public ktp!: string;
  public dob!: Date;
  public age!: number;
  public email!: string;
  public contact_number!: string;
  public address!: string;
  public relation_id!: string;
  public relation_name!: string;
  public status!: number;
  public created_by!: string;
  public created_date!: Date;
  public modified_by!: string;
  public modified_date!: Date;
}

export function initClient(sequelize: Sequelize) {
  Client.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
      },
      cin: {
        type: DataTypes.STRING,
      },
      name: {
        type: DataTypes.STRING,
      },
      ktp: {
        type: DataTypes.STRING,
      },
      dob: {
        type: DataTypes.DATEONLY,
      },
      age: {
        type: DataTypes.INTEGER,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
      },
      contact_number: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.STRING,
      },
      relation_id: {
        type: DataTypes.STRING,
      },
      relation_name: {
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
      modelName: 'Client',
      tableName: 'client',
      timestamps: false,
    }
  );

  Client.beforeCreate((survey_event) => {
    survey_event?.setDataValue('id', uuidv4());
  });
  return Client;
}

export function associateClient() {}

export default Client;
