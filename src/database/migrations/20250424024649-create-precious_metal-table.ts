'use strict';

import { QueryInterface } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(`
    CREATE TABLE precious_metal (
      precious_metal_id varchar(50) NOT NULL,
      precious_metal_holder varchar(50) DEFAULT NULL,
      precious_metal_name varchar(250) DEFAULT NULL,
      type varchar(250) DEFAULT NULL,
      amount decimal(12,2) DEFAULT NULL,
      unit varchar(250) DEFAULT NULL,
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
      PRIMARY KEY (precious_metal_id),
      UNIQUE (precious_metal_id)
    );
  `);
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(`DROP TABLE IF EXISTS precious_metal;`);
};
