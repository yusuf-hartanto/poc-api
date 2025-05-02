'use strict';

import { QueryInterface } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(
    `ALTER TABLE survey_form_answer_value ADD periode date DEFAULT NULL AFTER form_id;`
  );
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(
    `ALTER TABLE survey_form_answer_value DROP COLUMN periode;`
  );
};
