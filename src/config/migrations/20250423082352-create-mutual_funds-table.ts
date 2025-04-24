'use strict';

import { QueryInterface } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(`
    CREATE TABLE mutual_funds (
      mutual_funds_id varchar(50) NOT NULL,
      mutual_funds_holder varchar(50) DEFAULT NULL,
      mutual_funds_name varchar(250) DEFAULT NULL,
      type varchar(250) DEFAULT NULL,
      fund_manager varchar(50) DEFAULT NULL,
      maturity_date date DEFAULT NULL,
      purchase_date date DEFAULT NULL,
      purchase_value decimal(12,2) DEFAULT NULL,
      currency varchar(250) DEFAULT NULL,
      current_value decimal(12,2) DEFAULT NULL,
      selling_agent varchar(250) DEFAULT NULL,
      notes varchar(255) DEFAULT NULL,
      \`status\` int(11) DEFAULT NULL,
      created_by varchar(50) DEFAULT NULL,
      created_date datetime DEFAULT NULL,
      modified_by varchar(50) DEFAULT NULL,
      modified_date datetime DEFAULT NULL,
      PRIMARY KEY (mutual_funds_id) USING BTREE,
      UNIQUE KEY unique_mutual_funds_id (mutual_funds_id) USING BTREE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(`DROP TABLE IF EXISTS mutual_funds;`);
};
