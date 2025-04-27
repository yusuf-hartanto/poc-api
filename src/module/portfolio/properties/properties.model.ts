'use strict';

import { v4 as uuidv4 } from 'uuid';
import { DataTypes } from 'sequelize';
import conn from '../../../config/database';
import Client from '../../insurance/client/client.model';

const Model = conn.sequelize.define(
  'properties',
  {
    properties_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true,
    },
    properties_holder: {
      type: DataTypes.STRING,
    },
    properties_name: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.STRING,
    },
    ownership: {
      type: DataTypes.STRING,
    },
    certificate_number: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    purchase_date: {
      type: DataTypes.DATEONLY,
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
    land_area: {
      type: DataTypes.DECIMAL,
    },
    building_area: {
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
  (properties: { properties_id: string }) =>
    (properties.properties_id = uuidv4())
);
Model.belongsTo(Client, { as: 'holder', foreignKey: 'properties_holder' });

export default Model;
