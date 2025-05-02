'use strict';

import { QueryInterface } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(`
    CREATE TABLE bonds (
      bonds_id varchar(50) NOT NULL,
      bonds_holder varchar(50) DEFAULT NULL,
      bonds_name varchar(250) DEFAULT NULL,
      type varchar(250) DEFAULT NULL,
      product_number varchar(50) DEFAULT NULL,
      issuer_name varchar(250) DEFAULT NULL,
      issuer_date date DEFAULT NULL,
      maturity_date date DEFAULT NULL,
      currency varchar(250) DEFAULT NULL,
      amount decimal(12,2) DEFAULT NULL,
      interest_rate decimal(12,2) DEFAULT NULL,
      notes varchar(255) DEFAULT NULL,
      status int DEFAULT NULL,
      created_by varchar(50) DEFAULT NULL,
      created_date timestamp DEFAULT NULL,
      modified_by varchar(50) DEFAULT NULL,
      modified_date timestamp DEFAULT NULL,
      PRIMARY KEY (bonds_id),
      UNIQUE (bonds_id)
    );
  `);
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(`DROP TABLE IF EXISTS bonds;`);
};
