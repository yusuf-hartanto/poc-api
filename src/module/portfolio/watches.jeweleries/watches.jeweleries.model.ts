'use strict';

import { v4 as uuidv4 } from 'uuid';
import { DataTypes } from 'sequelize';
import conn from '../../../config/database';
import Client from '../../insurance/client/client.model';

const Model = conn.sequelize.define(
  'watches_jeweleries',
  {
    watches_jeweleries_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true,
    },
    watches_jeweleries_holder: {
      type: DataTypes.STRING,
    },
    watches_jeweleries_name: {
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
  (watches_jeweleries: { watches_jeweleries_id: string }) =>
    (watches_jeweleries.watches_jeweleries_id = uuidv4())
);
Model.belongsTo(Client, {
  as: 'holder',
  foreignKey: 'watches_jeweleries_holder',
});

export default Model;
