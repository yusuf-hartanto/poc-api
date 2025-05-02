'use strict';

import { QueryInterface } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(`
    CREATE TABLE crypto_assets (
      crypto_assets_id varchar(50) NOT NULL,
      crypto_assets_holder varchar(50) DEFAULT NULL,
      crypto_assets_name varchar(250) DEFAULT NULL,
      broker varchar(250) DEFAULT NULL,
      account_number varchar(50) DEFAULT NULL,
      userid varchar(250) DEFAULT NULL,
      coin_name varchar(250) DEFAULT NULL,
      coin_amount decimal(12,2) DEFAULT NULL,
      currency varchar(250) DEFAULT NULL,
      purchase_value decimal(12,2) DEFAULT NULL,
      current_value decimal(12,2) DEFAULT NULL,
      notes varchar(255) DEFAULT NULL,
      status int DEFAULT NULL,
      created_by varchar(50) DEFAULT NULL,
      created_date timestamp DEFAULT NULL,
      modified_by varchar(50) DEFAULT NULL,
      modified_date timestamp DEFAULT NULL,
      PRIMARY KEY (crypto_assets_id),
      UNIQUE (crypto_assets_id)
    );
  `);
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(`DROP TABLE IF EXISTS crypto_assets;`);
};
