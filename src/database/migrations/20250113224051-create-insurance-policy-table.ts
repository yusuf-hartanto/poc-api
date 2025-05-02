'use strict';

import { QueryInterface } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(`
    CREATE TABLE insurance_policy (
      policy_id varchar(50) NOT NULL,
      policy_number varchar(250) NOT NULL,
      provider_company varchar(250) NOT NULL,
      product_name varchar(250) NOT NULL,
      policy_holder varchar(50) DEFAULT NULL,
      insured_holder varchar(50) DEFAULT NULL,
      beneficiary_holder text DEFAULT NULL,
      issued_date date DEFAULT NULL,
      premi_currency varchar(250) DEFAULT NULL,
      premi_value decimal(12,2) DEFAULT NULL,
      premi_off varchar(100) DEFAULT NULL,
      payment_term int DEFAULT NULL,
      payment_term_unit varchar(100) DEFAULT NULL,
      insured_term int DEFAULT NULL,
      insured_term_unit varchar(100) DEFAULT NULL,
      due_date date DEFAULT NULL,
      seller_name varchar(250) DEFAULT NULL,
      notes varchar(255) DEFAULT NULL,
      status int NULL,
      created_by varchar(50) DEFAULT NULL,
      created_date timestamp DEFAULT NULL,
      modified_by varchar(50) DEFAULT NULL,
      modified_date timestamp DEFAULT NULL,
      PRIMARY KEY (policy_id),
      UNIQUE (policy_id)
    );
  `);
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(
    `DROP TABLE IF EXISTS insurance_policy;`
  );
};
