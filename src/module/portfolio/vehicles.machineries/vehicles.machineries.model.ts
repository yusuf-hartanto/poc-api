'use strict';

import { v4 as uuidv4 } from 'uuid';
import { DataTypes } from 'sequelize';
import conn from '../../../config/database';
import Client from '../../insurance/client/client.model';

const Model = conn.sequelize.define(
  'vehicles_machineries',
  {
    vehicles_machineries_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true,
    },
    vehicles_machineries_holder: {
      type: DataTypes.STRING,
    },
    vehicles_machineries_name: {
      type: DataTypes.STRING,
    },
    brand: {
      type: DataTypes.STRING,
    },
    type: {
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
  (vehicles_machineries: { vehicles_machineries_id: string }) =>
    (vehicles_machineries.vehicles_machineries_id = uuidv4())
);
Model.belongsTo(Client, {
  as: 'holder',
  foreignKey: 'vehicles_machineries_holder',
});

export default Model;
