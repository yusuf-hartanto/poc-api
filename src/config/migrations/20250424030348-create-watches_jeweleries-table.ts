'use strict';

import { QueryInterface } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(`
    CREATE TABLE watches_jeweleries (
      watches_jeweleries_id varchar(50) NOT NULL,
      watches_jeweleries_holder varchar(50) DEFAULT NULL,
      watches_jeweleries_name varchar(250) DEFAULT NULL,
      brand varchar(250) DEFAULT NULL,
      type varchar(250) DEFAULT NULL,
      currency varchar(250) DEFAULT NULL,
      purchase_value decimal(12,2) DEFAULT NULL,
      current_value decimal(12,2) DEFAULT NULL,
      location varchar(250) DEFAULT NULL,
      doc_location varchar(250) DEFAULT NULL,
      notes varchar(255) DEFAULT NULL,
      \`status\` int(11) DEFAULT NULL,
      created_by varchar(50) DEFAULT NULL,
      created_date datetime DEFAULT NULL,
      modified_by varchar(50) DEFAULT NULL,
      modified_date datetime DEFAULT NULL,
      PRIMARY KEY (watches_jeweleries_id) USING BTREE,
      UNIQUE KEY unique_watches_jeweleries_id (watches_jeweleries_id) USING BTREE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(
    `DROP TABLE IF EXISTS watches_jeweleries;`
  );
};
