'use strict';

import { v4 as uuidv4 } from 'uuid';
import { DataTypes } from 'sequelize';
import conn from '../../../config/database';
import Client from '../../insurance/client/client.model';

const Model = conn.sequelize.define(
  'shares_business',
  {
    shares_business_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true,
    },
    shares_business_holder: {
      type: DataTypes.STRING,
    },
    shares_business_name: {
      type: DataTypes.STRING,
    },
    class: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.STRING,
    },
    acquisition_date: {
      type: DataTypes.DATEONLY,
    },
    no_of_shares: {
      type: DataTypes.STRING,
    },
    percentage: {
      type: DataTypes.DECIMAL,
    },
    entity_name: {
      type: DataTypes.STRING,
    },
    contact_number: {
      type: DataTypes.STRING,
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
  (shares_business: { shares_business_id: string }) =>
    (shares_business.shares_business_id = uuidv4())
);
Model.belongsTo(Client, { as: 'holder', foreignKey: 'shares_business_holder' });

export default Model;
