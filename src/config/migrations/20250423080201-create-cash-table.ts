'use strict';

import { QueryInterface } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(`
    CREATE TABLE cash (
      cash_id varchar(50) COLLATE NOT NULL,
      cash_holder varchar(50) COLLATE DEFAULT NULL,
      cash_name varchar(250) COLLATE DEFAULT NULL,
      type varchar(250) COLLATE DEFAULT NULL,
      product_number varchar(50) COLLATE DEFAULT NULL,
      bank_name varchar(250) COLLATE utf8_unicode_ci DEFAULT NULL,
      start_date date DEFAULT NULL,
      maturity_date date DEFAULT NULL,
      currency varchar(250) COLLATE DEFAULT NULL,
      amount decimal(12,2) DEFAULT NULL,
      payor decimal(12,2) DEFAULT NULL,
      payee decimal(12,2) DEFAULT NULL,
      aro decimal(12,2) DEFAULT NULL,
      location text COLLATE DEFAULT NULL,
      notes varchar(255) COLLATE DEFAULT NULL,
      \`status\` int(11) DEFAULT NULL,
      created_by varchar(50) COLLATE DEFAULT NULL,
      created_date datetime DEFAULT NULL,
      modified_by varchar(50) COLLATE DEFAULT NULL,
      modified_date datetime DEFAULT NULL,
      PRIMARY KEY (cash_id) USING BTREE,
      UNIQUE KEY unique_cash_id (cash_id) USING BTREE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(`DROP TABLE IF EXISTS cash;`);
};
