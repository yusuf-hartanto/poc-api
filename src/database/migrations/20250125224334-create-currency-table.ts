'use strict';

import dotenv from 'dotenv';
import { QueryInterface } from 'sequelize';

dotenv.config();

export const up = async (queryInterface: QueryInterface) => {
  let column = '';
  if (process.env.DB_DIALECT == 'postgres') {
    column = `
      key varchar(50) DEFAULT NULL,
      value decimal(12,2) DEFAULT 0,
    `;
  }
  if (process.env.DB_DIALECT == 'mysql') {
    column = `
      \`key\` varchar(50) DEFAULT NULL,
      \`value\` decimal(12,2) DEFAULT 0,
    `;
  }
  await queryInterface.sequelize.query(`
    CREATE TABLE currency (
      id varchar(50) NOT NULL,
      base varchar(50) DEFAULT NULL,
      ${column}
      last_update DATE DEFAULT NULL,
      time_last_updated TIME DEFAULT NULL,
      PRIMARY KEY (id),
      UNIQUE (id)
    );
  `);
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(`DROP TABLE IF EXISTS currency;`);
};
