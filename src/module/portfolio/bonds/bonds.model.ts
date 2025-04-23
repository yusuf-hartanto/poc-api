'use strict';

import { v4 as uuidv4 } from 'uuid';
import { DataTypes } from 'sequelize';
import conn from '../../../config/database';
import Client from '../../insurance/client/client.model';

const Model = conn.sequelize.define(
  'bonds',
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
    createdAt: false,
    updatedAt: false,
    freezeTableName: true,
  }
);

Model.beforeCreate(
  (bonds: { bonds_id: string }) =>
    (bonds.bonds_id = uuidv4())
);
Model.belongsTo(Client, { as: 'holder', foreignKey: 'bonds_holder' });

export default Model;
