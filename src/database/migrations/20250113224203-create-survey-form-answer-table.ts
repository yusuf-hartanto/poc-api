'use strict';

import { QueryInterface } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(`
    CREATE TABLE survey_form_answer (
      answer_id varchar(50) NOT NULL,
      question_id varchar(50) NOT NULL,
      text_answer varchar(255) DEFAULT NULL,
      alert_answer text DEFAULT NULL,
      nourut int DEFAULT NULL,
      created_by varchar(50) DEFAULT NULL,
      created_date timestamp DEFAULT NULL,
      modified_by varchar(50) DEFAULT NULL,
      modified_date timestamp DEFAULT NULL,
      PRIMARY KEY (answer_id),
      UNIQUE (answer_id)
    );
  `);
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(
    `DROP TABLE IF EXISTS survey_form_answer;`
  );
};
