'use strict';

import { v4 as uuidv4 } from 'uuid';
import Client from '../../insurance/client/client.model';
import { DataTypes, Model, Sequelize } from 'sequelize';

export class Receivables extends Model {
  public receivables_id!: string;
  public receivables_holder!: string;
  public receivables_name!: string;
  public debtor_name!: string;
  public goods!: string;
  public contract_number!: string;
  public contract_date!: Date;
  public currency!: string;
  public total_receivable_amount!: number;
  public due_date!: Date;
  public location!: string;
  public doc_location!: string;
  public notes!: string;
  public status!: number;
  public created_by!: string;
  public created_date!: Date;
  public modified_by!: string;
  public modified_date!: Date;
}

export function initReceivables(sequelize: Sequelize) {
  Receivables.init(
    {
      receivables_id: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
      },
      receivables_holder: {
        type: DataTypes.STRING,
      },
      receivables_name: {
        type: DataTypes.STRING,
      },
      debtor_name: {
        type: DataTypes.STRING,
      },
      goods: {
        type: DataTypes.STRING,
      },
      contract_number: {
        type: DataTypes.STRING,
      },
      contract_date: {
        type: DataTypes.DATEONLY,
      },
      currency: {
        type: DataTypes.STRING,
      },
      total_receivable_amount: {
        type: DataTypes.DECIMAL,
      },
      due_date: {
        type: DataTypes.DATEONLY,
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
      modelName: 'Receivables',
      tableName: 'receivables',
      timestamps: false,
    }
  );

  Receivables.beforeCreate((receivables) => {
    receivables?.setDataValue('receivables_id', uuidv4());
  });
  return Receivables;
}

export function associateReceivables() {
  Receivables.belongsTo(Client, {
    as: 'holder',
    foreignKey: 'receivables_holder',
  });
}

export default Receivables;
