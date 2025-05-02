'use strict';

import { QueryInterface } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(`
    CREATE TABLE survey_form (
      question_id varchar(50) NOT NULL,
      form_id varchar(50) NOT NULL,
      question varchar(255) DEFAULT NULL,
      parent_id varchar(50) DEFAULT NULL,
      type varchar(20) DEFAULT NULL,
      nourut int DEFAULT NULL,
      url_image1 varchar(255) DEFAULT NULL,
      url_image2 varchar(255) DEFAULT NULL,
      is_active int DEFAULT 1,
      created_by varchar(50) DEFAULT NULL,
      created_date timestamp DEFAULT NULL,
      modified_by varchar(50) DEFAULT NULL,
      modified_date timestamp DEFAULT NULL,
      PRIMARY KEY (question_id),
      UNIQUE (question_id)
    );
  `);
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(`DROP TABLE IF EXISTS survey_form;`);
};
