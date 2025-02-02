'use strict';

import { QueryInterface } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(
    `ALTER TABLE app_resource ADD client_id varchar(50) DEFAULT NULL AFTER total_login;`
  );
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(
    `ALTER TABLE app_resource DROP COLUMN client_id;`
  );
};
