'use strict';

import { QueryInterface } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(`
    ALTER TABLE insurance_policy_detail
    CHANGE benefit benefit VARCHAR(255) CHARSET utf8mb4 COLLATE utf8mb4_bin NULL,
    ADD COLUMN start_date DATE NULL AFTER benefit,
    ADD COLUMN end_date DATE NULL AFTER start_date;
  `);
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(`
    ALTER TABLE insurance_policy_detail
    CHANGE benefit benefit varchar(255) LONGTEXT NULL,
    DROP COLUMN start_date,
    DROP COLUMN end_date;
  `);
};
