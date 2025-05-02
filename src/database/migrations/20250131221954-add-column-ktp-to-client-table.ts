'use strict';

import { QueryInterface } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(
    `ALTER TABLE client ADD ktp varchar(20) DEFAULT NULL AFTER name;`
  );
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(`ALTER TABLE client DROP COLUMN ktp;`);
};
