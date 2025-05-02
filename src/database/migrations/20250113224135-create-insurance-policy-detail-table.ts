'use strict';

import { QueryInterface } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(`
    CREATE TABLE insurance_policy_detail (
      id varchar(50) NOT NULL,
      policy_id varchar(50) NOT NULL,
      unit_link int NOT NULL,
      fund text DEFAULT NULL,
      cash_value decimal(12,2) DEFAULT NULL,
      benefit text DEFAULT NULL,
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
  await queryInterface.sequelize.query(
    `DROP TABLE IF EXISTS insurance_policy_detail;`
  );
};
