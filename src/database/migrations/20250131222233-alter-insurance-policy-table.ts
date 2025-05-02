'use strict';

import { QueryInterface } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(`
    ALTER TABLE insurance_policy
    ADD COLUMN unit_link int DEFAULT NULL,
    ADD COLUMN fund text DEFAULT NULL,
    ADD COLUMN cash_value decimal(12,2) DEFAULT NULL;
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
