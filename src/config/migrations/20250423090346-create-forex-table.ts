'use strict';

import { QueryInterface } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(`
    CREATE TABLE forex (
      forex_id varchar(50) COLLATE NOT NULL,
      forex_holder varchar(50) COLLATE DEFAULT NULL,
      forex_name varchar(250) COLLATE DEFAULT NULL,
      broker varchar(250) COLLATE DEFAULT NULL,
      account_number varchar(50) COLLATE DEFAULT NULL,
      userid varchar(50) COLLATE DEFAULT NULL,
      currency varchar(250) COLLATE DEFAULT NULL,
      purchase_value decimal(12,2) DEFAULT NULL,
      current_value decimal(12,2) DEFAULT NULL,
      notes varchar(255) COLLATE DEFAULT NULL,
      \`status\` int(11) DEFAULT NULL,
      created_by varchar(50) COLLATE DEFAULT NULL,
      created_date datetime DEFAULT NULL,
      modified_by varchar(50) COLLATE DEFAULT NULL,
      modified_date datetime DEFAULT NULL,
      PRIMARY KEY (forex_id) USING BTREE,
      UNIQUE KEY unique_forex_id (forex_id) USING BTREE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(`DROP TABLE IF EXISTS forex;`);
};
