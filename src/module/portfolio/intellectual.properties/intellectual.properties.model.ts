'use strict';

import { v4 as uuidv4 } from 'uuid';
import { DataTypes } from 'sequelize';
import conn from '../../../config/database';
import Client from '../../insurance/client/client.model';

const Model = conn.sequelize.define(
  'intellectual_properties',
  {
    intellectual_properties_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true,
    },
    intellectual_properties_holder: {
      type: DataTypes.STRING,
    },
    intellectual_properties_name: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.STRING,
    },
    creation_date: {
      type: DataTypes.DATEONLY,
    },
    appraised_value: {
      type: DataTypes.DECIMAL,
    },
    appraised_name: {
      type: DataTypes.STRING,
    },
    contract_number: {
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
  (intellectual_properties: { intellectual_properties_id: string }) =>
    (intellectual_properties.intellectual_properties_id = uuidv4())
);
Model.belongsTo(Client, {
  as: 'holder',
  foreignKey: 'intellectual_properties_holder',
});

export default Model;
