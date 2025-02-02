'use strict';

import { v4 as uuidv4 } from 'uuid';
import { DataTypes } from 'sequelize';
import Detail from './policy.detail.model';
import conn from '../../../config/database';

const Model = conn.sequelize.define(
  'insurance_policy',
  {
    policy_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true,
    },
    policy_number: {
      type: DataTypes.STRING,
    },
    provider_company: {
      type: DataTypes.STRING,
    },
    product_name: {
      type: DataTypes.STRING,
    },
    policy_holder: {
      type: DataTypes.INTEGER,
    },
    insured_holder: {
      type: DataTypes.INTEGER,
    },
    beneficiary_holder: {
      type: DataTypes.STRING,
    },
    issued_date: {
      type: DataTypes.DATEONLY,
    },
    premi_currency: {
      type: DataTypes.STRING,
    },
    premi_value: {
      type: DataTypes.DECIMAL,
    },
    premi_off: {
      type: DataTypes.STRING,
    },
    payment_term: {
      type: DataTypes.INTEGER,
    },
    payment_term_unit: {
      type: DataTypes.STRING,
    },
    insured_term: {
      type: DataTypes.INTEGER,
    },
    insured_term_unit: {
      type: DataTypes.STRING,
    },
    due_date: {
      type: DataTypes.DATEONLY,
    },
    seller_name: {
      type: DataTypes.STRING,
    },
    notes: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
    },
    unit_link: {
      type: DataTypes.TINYINT,
    },
    fund: {
      type: DataTypes.STRING,
    },
    cash_value: {
      type: DataTypes.DECIMAL,
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
  (insurance_policy: { policy_id: string }) =>
    (insurance_policy.policy_id = uuidv4())
);
Model.hasMany(Detail, { as: 'detail', foreignKey: 'policy_id' });

export default Model;
