'use strict';

import { v4 as uuidv4 } from 'uuid';
import PolicyDetail from './policy.detail.model';
import { DataTypes, Model, Sequelize } from 'sequelize';

export class Policy extends Model {
  public policy_id!: string;
  public policy_number!: string;
  public provider_company!: string;
  public product_name!: string;
  public policy_holder!: string;
  public insured_holder!: string;
  public beneficiary_holder!: string;
  public issued_date!: Date;
  public premi_currency!: string;
  public premi_value!: number;
  public premi_off!: string;
  public payment_term!: number;
  public payment_term_unit!: string;
  public insured_term!: number;
  public insured_term_unit!: string;
  public due_date!: Date;
  public seller_name!: string;
  public notes!: string;
  public status!: number;
  public unit_link!: number;
  public fund!: string;
  public cash_value!: number;
  public created_by!: string;
  public created_date!: Date;
  public modified_by!: string;
  public modified_date!: Date;
}

export function initPolicy(sequelize: Sequelize) {
  Policy.init(
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
        type: DataTypes.STRING,
      },
      insured_holder: {
        type: DataTypes.STRING,
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
        defaultValue: 0,
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
      sequelize,
      modelName: 'Policy',
      tableName: 'insurance_policy',
      timestamps: false,
    }
  );

  Policy.beforeCreate((insurance_policy) => {
    insurance_policy?.setDataValue('policy_id', uuidv4());
  });
  return Policy;
}

export function associatePolicy() {
  Policy.hasMany(PolicyDetail, { as: 'detail', foreignKey: 'policy_id' });
}

export default Policy;
