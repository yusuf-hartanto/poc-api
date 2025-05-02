'use strict';

import dotenv from 'dotenv';
import { QueryInterface } from 'sequelize';

dotenv.config();

export const up = async (queryInterface: QueryInterface) => {
  if (process.env.DB_DIALECT == 'postgres') {
    await queryInterface.sequelize.query(`
      ALTER TABLE insurance_policy_detail
      ALTER COLUMN benefit TYPE VARCHAR(255),
      ADD COLUMN start_date DATE NULL,
      ADD COLUMN end_date DATE NULL;
    `);
  }
  if (process.env.DB_DIALECT == 'mysql') {
    await queryInterface.sequelize.query(`
      ALTER TABLE insurance_policy_detail
      MODIFY COLUMN benefit VARCHAR(255),
      ADD COLUMN start_date DATE NULL,
      ADD COLUMN end_date DATE NULL;
    `);
  }
};

export const down = async (queryInterface: QueryInterface) => {
  if (process.env.DB_DIALECT == 'postgres') {
    await queryInterface.sequelize.query(`
      ALTER TABLE insurance_policy_detail
      ALTER COLUMN benefit TYPE varchar(255),
      DROP COLUMN start_date,
      DROP COLUMN end_date;
    `);
  }
  if (process.env.DB_DIALECT == 'mysql') {
    await queryInterface.sequelize.query(`
      ALTER TABLE insurance_policy_detail
      MODIFY COLUMN benefit varchar(255),
      DROP COLUMN start_date,
      DROP COLUMN end_date;
    `);
  }
};
