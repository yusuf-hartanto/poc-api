'use strict';

import dotenv from 'dotenv';
import { QueryInterface } from 'sequelize';

dotenv.config();

export const up = async (queryInterface: QueryInterface) => {
  let column = '';
  if (process.env.DB_DIALECT == 'postgres') {
    column = `
      "event" varchar(255) DEFAULT NULL,
      "desc" varchar(255) DEFAULT NULL,
    `;
  }
  if (process.env.DB_DIALECT == 'mysql') {
    column = `
      \`event\` varchar(255) DEFAULT NULL,
      \`desc\` varchar(255) DEFAULT NULL,
    `;
  }
  await queryInterface.sequelize.query(`
    CREATE TABLE survey_event (
      id varchar(50) NOT NULL,
      form_id varchar(50) NOT NULL,
      ${column}
      start_period timestamp DEFAULT NULL,
      end_period timestamp DEFAULT NULL,
      is_active int DEFAULT 1,
      is_random int NOT NULL DEFAULT 0,
      created_by varchar(50) DEFAULT NULL,
      created_date timestamp DEFAULT NULL,
      modified_by varchar(50) DEFAULT NULL,
      modified_date timestamp DEFAULT NULL,
      PRIMARY KEY (id),
      UNIQUE (id)
    );
  `);
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(`DROP TABLE IF EXISTS survey_event;`);
};
