'use strict';

import { v4 as uuidv4 } from 'uuid';
import Client from '../../insurance/client/client.model';
import { DataTypes, Model, Sequelize } from 'sequelize';

export class WatchesJeweleries extends Model {
  public watches_jeweleries_id!: string;
  public watches_jeweleries_holder!: string;
  public watches_jeweleries_name!: string;
  public brand!: string;
  public type!: string;
  public currency!: string;
  public purchase_value!: number;
  public current_value!: number;
  public location!: string;
  public doc_location!: string;
  public notes!: string;
  public status!: number;
  public created_by!: string;
  public created_date!: Date;
  public modified_by!: string;
  public modified_date!: Date;
}

export function initWatchesJeweleries(sequelize: Sequelize) {
  WatchesJeweleries.init(
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
      sequelize,
      modelName: 'WatchesJeweleries',
      tableName: 'watches_jeweleries',
      timestamps: false,
    }
  );

  WatchesJeweleries.beforeCreate((watches_jeweleries) => {
    watches_jeweleries?.setDataValue('watches_jeweleries_id', uuidv4());
  });
  return WatchesJeweleries;
}

export function associateWatchesJeweleries() {
  WatchesJeweleries.belongsTo(Client, {
    as: 'holder',
    foreignKey: 'watches_jeweleries_holder',
  });
}

export default WatchesJeweleries;
