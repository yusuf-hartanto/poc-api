'use strict';

import { QueryInterface } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(`
    CREATE TABLE bonds (
      bonds_id varchar(50) COLLATE NOT NULL,
      bonds_holder varchar(50) COLLATE DEFAULT NULL,
      bonds_name varchar(250) COLLATE DEFAULT NULL,
      type varchar(250) COLLATE DEFAULT NULL,
      product_number varchar(50) COLLATE DEFAULT NULL,
      issuer_name varchar(250) COLLATE DEFAULT NULL,
      issuer_date date DEFAULT NULL,
      maturity_date date DEFAULT NULL,
      currency varchar(250) COLLATE DEFAULT NULL,
      amount decimal(12,2) DEFAULT NULL,
      interest_rate decimal(12,2) DEFAULT NULL,
      notes varchar(255) COLLATE DEFAULT NULL,
      \`status\` int(11) DEFAULT NULL,
      created_by varchar(50) COLLATE DEFAULT NULL,
      created_date datetime DEFAULT NULL,
      modified_by varchar(50) COLLATE DEFAULT NULL,
      modified_date datetime DEFAULT NULL,
      PRIMARY KEY (bonds_id) USING BTREE,
      UNIQUE KEY unique_bonds_id (bonds_id) USING BTREE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(`DROP TABLE IF EXISTS bonds;`);
};
