'use strict';

import { QueryInterface } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(`
    CREATE TABLE shares_business (
      shares_business_id varchar(50) NOT NULL,
      shares_business_holder varchar(50) DEFAULT NULL,
      shares_business_name varchar(250) DEFAULT NULL,
      class varchar(250) DEFAULT NULL,
      type varchar(250) DEFAULT NULL,
      acquisition_date date DEFAULT NULL,
      no_of_shares varchar(250) DEFAULT NULL,
      percentage decimal(12,2) DEFAULT NULL,
      entity_name varchar(250) DEFAULT NULL,
      contact_number varchar(250) DEFAULT NULL,
      location varchar(250) DEFAULT NULL,
      doc_location varchar(250) DEFAULT NULL,
      notes varchar(255) DEFAULT NULL,
      \`status\` int(11) DEFAULT NULL,
      created_by varchar(50) DEFAULT NULL,
      created_date datetime DEFAULT NULL,
      modified_by varchar(50) DEFAULT NULL,
      modified_date datetime DEFAULT NULL,
      PRIMARY KEY (shares_business_id) USING BTREE,
      UNIQUE KEY unique_shares_business_id (shares_business_id) USING BTREE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(`DROP TABLE IF EXISTS shares_business;`);
};
