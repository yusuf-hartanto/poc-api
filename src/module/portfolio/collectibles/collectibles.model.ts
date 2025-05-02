'use strict';

import { v4 as uuidv4 } from 'uuid';
import Client from '../../insurance/client/client.model';
import { DataTypes, Model, Sequelize } from 'sequelize';

export class Collectibles extends Model {
  public collectibles_id!: string;
  public collectibles_holder!: string;
  public collectibles_name!: string;
  public type!: string;
  public description!: string;
  public purchase_date!: Date;
  public currency!: string;
  public purchase_value!: number;
  public current_value!: number;
  public location!: string;
  public notes!: string;
  public status!: number;
  public created_by!: string;
  public created_date!: Date;
  public modified_by!: string;
  public modified_date!: Date;
}

export function initCollectibles(sequelize: Sequelize) {
  Collectibles.init(
    {
      collectibles_id: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
      },
      collectibles_holder: {
        type: DataTypes.STRING,
      },
      collectibles_name: {
        type: DataTypes.STRING,
      },
      type: {
        type: DataTypes.STRING,
      },
      description: {
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
      location: {
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
      modelName: 'Collectibles',
      tableName: 'collectibles',
      timestamps: false,
    }
  );

  Collectibles.beforeCreate((collectibles) => {
    collectibles?.setDataValue('collectibles_id', uuidv4());
  });
  return Collectibles;
}

export function associateCollectibles() {
  Collectibles.belongsTo(Client, {
    as: 'holder',
    foreignKey: 'collectibles_holder',
  });
}

export default Collectibles;
