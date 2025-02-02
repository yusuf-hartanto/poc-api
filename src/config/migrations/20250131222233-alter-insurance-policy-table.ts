'use strict';

import { QueryInterface } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(`
    ALTER TABLE insurance_policy
    ADD COLUMN unit_link int(1) NOT NULL AFTER status,
    ADD COLUMN fund longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin AFTER unit_link,
    ADD COLUMN cash_value decimal(12,2) DEFAULT NULL AFTER fund;
  `);
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(`
    ALTER TABLE insurance_policy
    DROP COLUMN unit_link,
    DROP COLUMN fund,
    DROP COLUMN cash_value;
  `);
};
