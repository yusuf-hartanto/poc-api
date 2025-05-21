'use strict';

import { QueryInterface } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(`
    ALTER TABLE safe_deposit_box
    ADD sdb_holder varchar(50) DEFAULT NULL,
    ADD flag_sdb int DEFAULT 1;
  `);
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(`
    ALTER TABLE safe_deposit_box
    DROP COLUMN sdb_holder,
    DROP COLUMN flag_sdb;
  `);
};
