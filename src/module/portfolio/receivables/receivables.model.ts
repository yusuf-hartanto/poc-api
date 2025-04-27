'use strict';

import { v4 as uuidv4 } from 'uuid';
import { DataTypes } from 'sequelize';
import conn from '../../../config/database';
import Client from '../../insurance/client/client.model';

const Model = conn.sequelize.define(
  'receivables',
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
    createdAt: false,
    updatedAt: false,
    freezeTableName: true,
  }
);

Model.beforeCreate(
  (receivables: { receivables_id: string }) =>
    (receivables.receivables_id = uuidv4())
);
Model.belongsTo(Client, { as: 'holder', foreignKey: 'receivables_holder' });

export default Model;
