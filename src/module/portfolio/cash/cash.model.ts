'use strict';

import { v4 as uuidv4 } from 'uuid';
import { DataTypes } from 'sequelize';
import conn from '../../../config/database';
import Client from '../../insurance/client/client.model';

const Model = conn.sequelize.define(
  'cash',
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
    createdAt: false,
    updatedAt: false,
    freezeTableName: true,
  }
);

Model.beforeCreate(
  (cash: { cash_id: string }) =>
    (cash.cash_id = uuidv4())
);
Model.belongsTo(Client, { as: 'holder', foreignKey: 'cash_holder' });

export default Model;
