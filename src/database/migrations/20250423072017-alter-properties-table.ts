'use strict';

import { QueryInterface } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(`
    ALTER TABLE properties
    ADD ownership varchar(250) DEFAULT NULL AFTER type,
    ADD certificate_number varchar(250) DEFAULT NULL AFTER ownership,
    ADD purchase_date date DEFAULT NULL AFTER address,
    ADD current_value decimal(12,2) DEFAULT NULL AFTER currency,
    ADD location varchar(250) DEFAULT NULL AFTER doc_location;
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
