'use strict';

import { v4 as uuidv4 } from 'uuid';
import Client from '../../insurance/client/client.model';
import { DataTypes, Model, Sequelize } from 'sequelize';

export class VehiclesMachineries extends Model {
  public vehicles_machineries_id!: string;
  public vehicles_machineries_holder!: string;
  public vehicles_machineries_name!: string;
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

export function initVehiclesMachineries(sequelize: Sequelize) {
  VehiclesMachineries.init(
    {
      vehicles_machineries_id: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
      },
      vehicles_machineries_holder: {
        type: DataTypes.STRING,
      },
      vehicles_machineries_name: {
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
      modelName: 'VehiclesMachineries',
      tableName: 'vehicles_machineries',
      timestamps: false,
    }
  );

  VehiclesMachineries.beforeCreate((vehicles_machineries) => {
    vehicles_machineries?.setDataValue('vehicles_machineries_id', uuidv4());
  });
  return VehiclesMachineries;
}

export function associateVehiclesMachineries() {
  VehiclesMachineries.belongsTo(Client, {
    as: 'holder',
    foreignKey: 'vehicles_machineries_holder',
  });
}

export default VehiclesMachineries;
