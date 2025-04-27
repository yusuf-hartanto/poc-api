'use strict';

import { v4 as uuidv4 } from 'uuid';
import { DataTypes } from 'sequelize';
import conn from '../../../config/database';
import Client from '../../insurance/client/client.model';

const Model = conn.sequelize.define(
  'precious_metal',
  {
    precious_metal_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true,
    },
    precious_metal_holder: {
      type: DataTypes.STRING,
    },
    precious_metal_name: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.STRING,
    },
    amount: {
      type: DataTypes.DECIMAL,
    },
    unit: {
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
  (precious_metal: { precious_metal_id: string }) =>
    (precious_metal.precious_metal_id = uuidv4())
);
Model.belongsTo(Client, { as: 'holder', foreignKey: 'precious_metal_holder' });

export default Model;
