'use strict';

import { v4 as uuidv4 } from 'uuid';
import { DataTypes } from 'sequelize';
import conn from '../../../config/database';
import Client from '../../insurance/client/client.model';

const Model = conn.sequelize.define(
  'stocks',
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
    createdAt: false,
    updatedAt: false,
    freezeTableName: true,
  }
);

Model.beforeCreate(
  (stocks: { stocks_id: string }) => (stocks.stocks_id = uuidv4())
);
Model.belongsTo(Client, { as: 'holder', foreignKey: 'stocks_holder' });

export default Model;
