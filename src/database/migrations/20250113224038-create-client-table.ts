'use strict';

import { QueryInterface } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(`
    CREATE TABLE client (
      id varchar(50) NOT NULL,
      name varchar(250) NOT NULL,
      bod date DEFAULT NULL,
      age int DEFAULT NULL,
      contact_number text DEFAULT NULL,
      address varchar(255) DEFAULT NULL,
      relation_id varchar(50) DEFAULT NULL,
      relation_name varchar(100) DEFAULT NULL,
      status int NULL,
      created_by varchar(50) DEFAULT NULL,
      created_date timestamp DEFAULT NULL,
      modified_by varchar(50) DEFAULT NULL,
      modified_date timestamp DEFAULT NULL,
      PRIMARY KEY (id),
      UNIQUE (id)
    );
  `);
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(`DROP TABLE IF EXISTS client;`);
};
