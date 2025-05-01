'use strict';

import { QueryInterface } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(
    `ALTER TABLE app_resource ADD token_expired datetime DEFAULT NULL AFTER token;`
  );
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(
    `ALTER TABLE app_resource DROP COLUMN token_expired;`
  );
};
