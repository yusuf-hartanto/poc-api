'use strict';

import { QueryInterface } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(
    `ALTER TABLE client CHANGE bod dob DATE NULL;`
  );
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(
    `ALTER TABLE client CHANGE dob bod DATE NULL;`
  );
};
