'use strict';

import { QueryInterface } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(`
    CREATE TABLE currency (
      id varchar(50) NOT NULL,
      base varchar(50) DEFAULT NULL,
      \`key\` varchar(50) DEFAULT NULL,
      \`value\` decimal(12,2) DEFAULT 0,
      last_update DATE DEFAULT NULL,
      time_last_updated TIME DEFAULT NULL,
      PRIMARY KEY (id),
      UNIQUE KEY unique_id (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(`DROP TABLE IF EXISTS currency;`);
};
