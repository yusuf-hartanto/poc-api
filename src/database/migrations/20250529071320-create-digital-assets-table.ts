'use strict';

import { QueryInterface } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(`
    CREATE TABLE digital_assets (
      digital_assets_id varchar(50) NOT NULL,
      digital_assets_holder varchar(50) DEFAULT NULL,
      digital_assets_name varchar(250) DEFAULT NULL,
      type varchar(250) DEFAULT NULL,
      selling_agent varchar(250) DEFAULT NULL,
      serial_number varchar(250) DEFAULT NULL,
      account_number varchar(250) DEFAULT NULL,
      userid varchar(250) DEFAULT NULL,
      currency varchar(250) DEFAULT NULL,
      purchase_value decimal(12,2) DEFAULT NULL,
      current_value decimal(12,2) DEFAULT NULL,
      location varchar(250) DEFAULT NULL,
      doc_location varchar(250) DEFAULT NULL,
      notes varchar(255) DEFAULT NULL,
      status int DEFAULT NULL,
      created_by varchar(50) DEFAULT NULL,
      created_date timestamp DEFAULT NULL,
      modified_by varchar(50) DEFAULT NULL,
      modified_date timestamp DEFAULT NULL,
      PRIMARY KEY (digital_assets_id),
      UNIQUE (digital_assets_id)
    );
  `);
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(`DROP TABLE IF EXISTS digital_assets;`);
};
