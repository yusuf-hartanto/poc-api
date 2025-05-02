'use strict';

import { v4 as uuidv4 } from 'uuid';
import Client from '../../insurance/client/client.model';
import { DataTypes, Model, Sequelize } from 'sequelize';

export class SharesBusiness extends Model {
  public shares_business_id!: string;
  public shares_business_holder!: string;
  public shares_business_name!: string;
  public class!: string;
  public type!: string;
  public acquisition_date!: Date;
  public no_of_shares!: string;
  public percentage!: number;
  public entity_name!: string;
  public contact_number!: string;
  public location!: string;
  public doc_location!: string;
  public notes!: string;
  public status!: number;
  public created_by!: string;
  public created_date!: Date;
  public modified_by!: string;
  public modified_date!: Date;
}

export function initSharesBusiness(sequelize: Sequelize) {
  SharesBusiness.init(
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
      sequelize,
      modelName: 'SharesBusiness',
      tableName: 'shares_business',
      timestamps: false,
    }
  );

  SharesBusiness.beforeCreate((shares_business) => {
    shares_business?.setDataValue('shares_business_id', uuidv4());
  });
  return SharesBusiness;
}

export function associateSharesBusiness() {
  SharesBusiness.belongsTo(Client, {
    as: 'holder',
    foreignKey: 'shares_business_holder',
  });
}

export default SharesBusiness;
