'use strict';

import { v4 as uuidv4 } from 'uuid';
import { DataTypes } from 'sequelize';
import conn from '../../config/database';

const Model = conn.sequelize.define(
  'currency',
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true,
    },
    base: {
      type: DataTypes.STRING,
    },
    key: {
      type: DataTypes.STRING,
    },
    value: {
      type: DataTypes.DECIMAL,
    },
    last_update: {
      type: DataTypes.DATEONLY,
    },
    time_last_updated: {
      type: DataTypes.TIME,
    },
  },
  {
    createdAt: false,
    updatedAt: false,
    freezeTableName: true,
  }
);

Model.beforeCreate((currency: { id: string }) => (currency.id = uuidv4()));

export default Model;
