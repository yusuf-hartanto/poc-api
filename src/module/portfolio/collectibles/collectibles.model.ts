'use strict';

import { v4 as uuidv4 } from 'uuid';
import { DataTypes } from 'sequelize';
import conn from '../../../config/database';
import Client from '../../insurance/client/client.model';

const Model = conn.sequelize.define(
  'collectibles',
  {
    collectibles_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true,
    },
    collectibles_holder: {
      type: DataTypes.STRING,
    },
    collectibles_name: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    purchase_date: {
      type: DataTypes.DATEONLY,
    },
    purchase_value: {
      type: DataTypes.DECIMAL,
    },
    currency: {
      type: DataTypes.STRING,
    },
    current_value: {
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
  (collectibles: { collectibles_id: string }) =>
    (collectibles.collectibles_id = uuidv4())
);
Model.belongsTo(Client, { as: 'holder', foreignKey: 'collectibles_holder' });

export default Model;
