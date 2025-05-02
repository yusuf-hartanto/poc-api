'use strict';

import { QueryInterface } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(`
    CREATE TABLE stocks (
      stocks_id varchar(50) NOT NULL,
      stocks_holder varchar(50) DEFAULT NULL,
      stocks_name varchar(250) DEFAULT NULL,
      broker varchar(250) DEFAULT NULL,
      account_number varchar(250) DEFAULT NULL,
      userid varchar(50) DEFAULT NULL,
      stock_name varchar(50) DEFAULT NULL,
      currency varchar(250) DEFAULT NULL,
      purchase_value decimal(12,2) DEFAULT NULL,
      current_value decimal(12,2) DEFAULT NULL,
      lot decimal(12,2) DEFAULT NULL,
      notes varchar(255) DEFAULT NULL,
      \`status\` int(11) DEFAULT NULL,
      created_by varchar(50) DEFAULT NULL,
      created_date datetime DEFAULT NULL,
      modified_by varchar(50) DEFAULT NULL,
      modified_date datetime DEFAULT NULL,
      PRIMARY KEY (stocks_id) USING BTREE,
      UNIQUE KEY unique_stocks_id (stocks_id) USING BTREE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(`DROP TABLE IF EXISTS stocks;`);
};
