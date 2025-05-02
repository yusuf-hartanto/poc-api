'use strict';

import { QueryInterface } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(`
    CREATE TABLE forex (
      forex_id varchar(50) NOT NULL,
      forex_holder varchar(50) DEFAULT NULL,
      forex_name varchar(250) DEFAULT NULL,
      broker varchar(250) DEFAULT NULL,
      account_number varchar(50) DEFAULT NULL,
      userid varchar(50) DEFAULT NULL,
      currency varchar(250) DEFAULT NULL,
      purchase_value decimal(12,2) DEFAULT NULL,
      current_value decimal(12,2) DEFAULT NULL,
      notes varchar(255) DEFAULT NULL,
      status int DEFAULT NULL,
      created_by varchar(50) DEFAULT NULL,
      created_date timestamp DEFAULT NULL,
      modified_by varchar(50) DEFAULT NULL,
      modified_date timestamp DEFAULT NULL,
      PRIMARY KEY (forex_id),
      UNIQUE (forex_id)
    );
  `);
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(`DROP TABLE IF EXISTS forex;`);
};
