'use strict';

import dotenv from 'dotenv';
import { QueryInterface } from 'sequelize';

dotenv.config();

export const up = async (queryInterface: QueryInterface) => {
  if (process.env.DB_DIALECT == 'postgres') {
    await queryInterface.sequelize.query(
      `ALTER TABLE client RENAME COLUMN bod TO dob;`
    );
  }
  if (process.env.DB_DIALECT == 'mysql') {
    await queryInterface.sequelize.query(
      `ALTER TABLE client CHANGE  COLUMN bod dob DATE;`
    );
  }
};

export const down = async (queryInterface: QueryInterface) => {
  if (process.env.DB_DIALECT == 'postgres') {
    await queryInterface.sequelize.query(
      `ALTER TABLE client RENAME COLUMN dob TO bod;`
    );
  }
  if (process.env.DB_DIALECT == 'mysql') {
    await queryInterface.sequelize.query(
      `ALTER TABLE client CHANGE  COLUMN dob bod DATE;`
    );
  }
};
