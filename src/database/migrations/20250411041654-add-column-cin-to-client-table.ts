'use strict';

import { QueryInterface } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(
    `ALTER TABLE client ADD cin varchar(100) DEFAULT NULL AFTER id;`
  );
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(`ALTER TABLE client DROP COLUMN cin;`);
};
