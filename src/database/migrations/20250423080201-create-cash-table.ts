'use strict';

import { QueryInterface } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(`
    CREATE TABLE cash (
      cash_id varchar(50) NOT NULL,
      cash_holder varchar(50) DEFAULT NULL,
      cash_name varchar(250) DEFAULT NULL,
      type varchar(250) DEFAULT NULL,
      product_number varchar(50) DEFAULT NULL,
      bank_name varchar(250) DEFAULT NULL,
      start_date date DEFAULT NULL,
      maturity_date date DEFAULT NULL,
      currency varchar(250) DEFAULT NULL,
      amount decimal(12,2) DEFAULT NULL,
      payor decimal(12,2) DEFAULT NULL,
      payee decimal(12,2) DEFAULT NULL,
      aro decimal(12,2) DEFAULT NULL,
      location text DEFAULT NULL,
      notes varchar(255) DEFAULT NULL,
      status int DEFAULT NULL,
      created_by varchar(50) DEFAULT NULL,
      created_date timestamp DEFAULT NULL,
      modified_by varchar(50) DEFAULT NULL,
      modified_date timestamp DEFAULT NULL,
      PRIMARY KEY (cash_id),
      UNIQUE (cash_id)
    );
  `);
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(`DROP TABLE IF EXISTS cash;`);
};
