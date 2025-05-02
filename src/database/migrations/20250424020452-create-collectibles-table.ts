'use strict';

import { QueryInterface } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(`
    CREATE TABLE collectibles (
      collectibles_id varchar(50) NOT NULL,
      collectibles_holder varchar(50) DEFAULT NULL,
      collectibles_name varchar(250) DEFAULT NULL,
      type varchar(250) DEFAULT NULL,
      description varchar(250) DEFAULT NULL,
      purchase_date date DEFAULT NULL,
      purchase_value decimal(12,2) DEFAULT NULL,
      currency varchar(250) DEFAULT NULL,
      current_value decimal(12,2) DEFAULT NULL,
      location varchar(250) DEFAULT NULL,
      notes varchar(255) DEFAULT NULL,
      status int DEFAULT NULL,
      created_by varchar(50) DEFAULT NULL,
      created_date timestamp DEFAULT NULL,
      modified_by varchar(50) DEFAULT NULL,
      modified_date timestamp DEFAULT NULL,
      PRIMARY KEY (collectibles_id),
      UNIQUE (collectibles_id)
    );
  `);
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(`DROP TABLE IF EXISTS collectibles;`);
};
