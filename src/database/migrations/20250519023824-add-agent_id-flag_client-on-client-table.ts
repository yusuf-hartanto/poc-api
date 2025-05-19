'use strict';

import { QueryInterface } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(`
    ALTER TABLE client
    ADD flag_client int DEFAULT NULL,
    ADD agent_id varchar(50) DEFAULT NULL;
  `);
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(`
    ALTER TABLE client
    DROP COLUMN flag_client,
    DROP COLUMN agent_id;
  `);
};
