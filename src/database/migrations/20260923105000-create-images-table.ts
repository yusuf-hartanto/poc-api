'use strict';

import { QueryInterface } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(`
    CREATE TABLE images (
      id varchar(50) NOT NULL,
      filename varchar(255) DEFAULT NULL,
      url text DEFAULT NULL,
      size bigint DEFAULT NULL,
      size_origin bigint DEFAULT NULL,
      mime_type varchar(100) DEFAULT NULL,
      created_at timestamp DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE (id)
    );
  `);
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(`DROP TABLE IF EXISTS images;`);
};
