'use strict';

import { v4 as uuidv4 } from 'uuid';
import Client from '../../insurance/client/client.model';
import { DataTypes, Model, Sequelize } from 'sequelize';

export class CryptoAssets extends Model {
  public crypto_assets_id!: string;
  public crypto_assets_holder!: string;
  public crypto_assets_name!: string;
  public broker!: string;
  public account_number!: string;
  public userid!: string;
  public coin_name!: string;
  public coin_amount!: number;
  public currency!: string;
  public purchase_value!: number;
  public current_value!: number;
  public notes!: string;
  public status!: number;
  public created_by!: string;
  public created_date!: Date;
  public modified_by!: string;
  public modified_date!: Date;
}

export function initCryptoAssets(sequelize: Sequelize) {
  CryptoAssets.init(
    {
      crypto_assets_id: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
      },
      crypto_assets_holder: {
        type: DataTypes.STRING,
      },
      crypto_assets_name: {
        type: DataTypes.STRING,
      },
      broker: {
        type: DataTypes.STRING,
      },
      account_number: {
        type: DataTypes.STRING,
      },
      userid: {
        type: DataTypes.STRING,
      },
      coin_name: {
        type: DataTypes.STRING,
      },
      coin_amount: {
        type: DataTypes.DECIMAL,
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
      modelName: 'CryptoAssets',
      tableName: 'crypto_assets',
      timestamps: false,
    }
  );

  CryptoAssets.beforeCreate((crypto_assets) => {
    crypto_assets?.setDataValue('crypto_assets_id', uuidv4());
  });
  return CryptoAssets;
}

export function associateCryptoAssets() {
  CryptoAssets.belongsTo(Client, {
    as: 'holder',
    foreignKey: 'crypto_assets_holder',
  });
}

export default CryptoAssets;
