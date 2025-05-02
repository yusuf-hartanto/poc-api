'use strict';

import { QueryInterface } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(`
    ALTER TABLE properties
    ADD ownership varchar(250) DEFAULT NULL,
    ADD certificate_number varchar(250) DEFAULT NULL,
    ADD purchase_date date DEFAULT NULL,
    ADD current_value decimal(12,2) DEFAULT NULL,
    ADD location varchar(250) DEFAULT NULL;
  `);
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(`
    ALTER TABLE properties
    DROP COLUMN ownership,
    DROP COLUMN certificate_number,
    DROP COLUMN purchase_date,
    DROP COLUMN current_value,
    DROP COLUMN location;
  `);
};
