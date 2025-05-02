'use strict';

import { QueryInterface } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(`
    CREATE TABLE intellectual_properties (
      intellectual_properties_id varchar(50) NOT NULL,
      intellectual_properties_holder varchar(50) DEFAULT NULL,
      intellectual_properties_name varchar(250) DEFAULT NULL,
      type varchar(250) DEFAULT NULL,
      creation_date date DEFAULT NULL,
      appraised_value decimal(12,2) DEFAULT NULL,
      appraised_name varchar(250) DEFAULT NULL,
      contract_number varchar(250) DEFAULT NULL,
      notes varchar(255) DEFAULT NULL,
      status int DEFAULT NULL,
      created_by varchar(50) DEFAULT NULL,
      created_date timestamp DEFAULT NULL,
      modified_by varchar(50) DEFAULT NULL,
      modified_date timestamp DEFAULT NULL,
      PRIMARY KEY (intellectual_properties_id),
      UNIQUE (intellectual_properties_id)
    );
  `);
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(
    `DROP TABLE IF EXISTS intellectual_properties;`
  );
};
