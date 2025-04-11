'use strict';

import { QueryInterface } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(`
    CREATE TABLE properties (
      properties_id varchar(50) DEFAULT NULL,
      properties_holder varchar(50) DEFAULT NULL,
      properties_name varchar(250) DEFAULT NULL,
      type varchar(250) DEFAULT NULL,
      address varchar(250) DEFAULT NULL,
      land_area decimal(12,2) DEFAULT NULL,
      building_area decimal(12,2) DEFAULT NULL,
      currency varchar(250) DEFAULT NULL,
      purchase_value decimal(12,2) DEFAULT NULL,
      doc_location text DEFAULT NULL,
      notes varchar(255) DEFAULT NULL,
      \`status\` int(11) DEFAULT NULL,
      created_by varchar(50) DEFAULT NULL,
      created_date datetime DEFAULT NULL,
      modified_by varchar(50) DEFAULT NULL,
      modified_date datetime DEFAULT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(`DROP TABLE IF EXISTS properties;`);
};
