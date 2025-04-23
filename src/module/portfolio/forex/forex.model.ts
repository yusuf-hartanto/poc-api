'use strict';

import { v4 as uuidv4 } from 'uuid';
import { DataTypes } from 'sequelize';
import conn from '../../../config/database';
import Client from '../../insurance/client/client.model';

const Model = conn.sequelize.define(
  'forex',
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
    createdAt: false,
    updatedAt: false,
    freezeTableName: true,
  }
);

Model.beforeCreate(
  (forex: { forex_id: string }) =>
    (forex.forex_id = uuidv4())
);
Model.belongsTo(Client, { as: 'holder', foreignKey: 'forex_holder' });

export default Model;
