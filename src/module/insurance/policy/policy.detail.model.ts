'use strict';

import { v4 as uuidv4 } from 'uuid';
import { DataTypes, Model, Sequelize } from 'sequelize';

export class PolicyDetail extends Model {
  public id!: string;
  public policy_id!: string;
  public unit_link!: number;
  public fund!: string;
  public cash_value!: number;
  public benefit!: string;
  public start_date!: Date;
  public end_date!: Date;
  public created_by!: string;
  public created_date!: Date;
  public modified_by!: string;
  public modified_date!: Date;
}

export function initPolicyDetail(sequelize: Sequelize) {
  PolicyDetail.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
      },
      policy_id: {
        type: DataTypes.STRING,
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
      benefit: {
        type: DataTypes.STRING,
      },
      start_date: {
        type: DataTypes.DATE,
      },
      end_date: {
        type: DataTypes.DATE,
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
      modelName: 'PolicyDetail',
      tableName: 'insurance_policy_detail',
      timestamps: false,
    }
  );

  PolicyDetail.beforeCreate((insurance_policy_detail) => {
    insurance_policy_detail?.setDataValue('id', uuidv4());
  });
  return PolicyDetail;
}

export function associatePolicyDetail() {}

export default PolicyDetail;
